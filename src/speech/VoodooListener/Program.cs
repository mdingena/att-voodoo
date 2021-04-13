using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebSocketSharp;
using Alta.WebApi.Utility;
using Alta.WebApi.Client;
using Newtonsoft.Json;
using System.IO;
using System.Speech.Recognition;
using System.Speech.Recognition.SrgsGrammar;
using System.Xml;
using System.Globalization;
using System.Threading;

namespace VoodooListener
{
	public class Config
	{
		public static Config Current
		{
			get
			{
				if (current == null)
				{
					Load();
				}

				return current;
			}

			private set
			{
				current = value;
			}
		}

		static Config current;

		public string Username { get; set; }

		public string Password { get; set; }

		public string GrammarFilePath { get; set; } = "grammar.xml";

		public float? OverrideConfidence { get; set; }

		public bool ConsoleMode { get; set; }

		public string Language { get; set; } = "en-US";

		public string AliasFilePath { get; set; } 

		const string ConfigFilePath = "config.json";

		public static void Load()
		{
			Current = JsonConvert.DeserializeObject<Config>(File.ReadAllText(ConfigFilePath));
		}

		public void Save()
		{
			File.WriteAllText(ConfigFilePath, JsonConvert.SerializeObject(this, Newtonsoft.Json.Formatting.Indented));
		}
	}

	class Program
	{
		public static void Main(string[] args)
		{
			Run().GetAwaiter().GetResult();
		}

		static async Task Run()
		{
			await LogIntoAlta();

			while (true)
			{
				var servers = (await AltaAPI.Client.ServerClient.GetOnlineServersAsync()).ToArray();

				for (int i = 0; i < servers.Length; i++)
				{
					Alta.WebApi.Models.GameServerInfo server = servers[i];
					Console.WriteLine("{0}: {1} - {2}", i, server.Identifier, server.Name);
				}

				Console.WriteLine("Which server do you want to connect to?");

				var serverNumber = int.Parse(Console.ReadLine());

				if (serverNumber < 0)
				{
					serverNumber = -1;
				}
				else
				{
					serverNumber = servers[serverNumber].Identifier;
				}

				VoodooListener listener = new VoodooListener();

				try
				{
					//await listener.ConnectAndListen(serverNumber);
					await listener.ConnectAndListen(1483589932);
				}
				catch (Exception e)
				{
					Console.WriteLine(e.Message);
				}
			}
		}

		static async Task LogIntoAlta()
		{
			string username = Config.Current.Username;
			string pw = Config.Current.Password;

			Console.WriteLine("Logging in as: {0}", username);

			if (pw.Length < 64)
			{
				pw = LoginUtilities.HashString(pw);
			}

			await AltaAPI.Client.LoginAsync(username, pw);

			Console.WriteLine("Logged in");

			Config.Current.Password = pw;

			Config.Current.Save();
		}

		public static class AltaAPI
		{
			public static IHighLevelApiClient Client { get; } = HighLevelApiClientFactory.CreateHighLevelClient();
		}

		public class VoodooListener
		{
			static int count;

			WebSocket webSocket;

			SpeechRecognitionEngine recognizer;

			Dictionary<string, Func<string, string>> aliases = new Dictionary<string, Func<string, string>>();

			CancellationTokenSource cancellation = new CancellationTokenSource();

			public VoodooListener()
			{
				aliases.Add("me", _ => AltaAPI.Client.UserClient.LoggedInUserInfo.Username);
				aliases.Add("everyone", _ => "*");

				if (!string.IsNullOrEmpty(Config.Current.AliasFilePath) && File.Exists(Config.Current.AliasFilePath))
				{
					LoadAliasFile();
				}
			}

			void LoadAliasFile()
			{
				foreach (var line in File.ReadAllLines(Config.Current.AliasFilePath))
				{
					var splitLine = line.Split(',');

					aliases.Add(splitLine[0], _ => splitLine[1]);

					Console.WriteLine("Loaded Alias: {0} => {1}", splitLine[0], splitLine[1]);
				}
			}

			public async Task ConnectAndListen(int serverIdentifier)
			{
				await ConnectToServer(serverIdentifier);

				SetupVoiceRecognizer();

				StartVoiceRecognition();

				Console.WriteLine("Start Speaking, say quit to stop the application");

				await Task.Delay(-1, cancellation.Token);
			}

			async Task ConnectToServer(int serverIdentifier)
			{
				var joinResult = await AltaAPI.Client.ServerClient.ConnectConsole(serverIdentifier, false, false);

				Console.WriteLine("Got Connection details, Allowed: {0}", joinResult.IsAllowed);

				if (!joinResult.IsAllowed)
				{
					throw new Exception("NOT ALLOWED");
				}

				string url = $"ws://{joinResult.ConnectionInfo.Address.ToString()}:{joinResult.ConnectionInfo.WebSocketPort}";

				//string url = $"ws://{joinResult.ConnectionInfo.Address.ToString()}:{7767}";

				webSocket = new WebSocket(url);

				//webSocket.OnMessage += (sender, e) => Console.WriteLine("Server: " + e.Data);

				webSocket.Connect();

				webSocket.Send(joinResult.Token.Write());
			}

			void StartVoiceRecognition()
			{
				if (!Config.Current.ConsoleMode)
				{
					recognizer.SetInputToDefaultAudioDevice();
					recognizer.RecognizeAsync(RecognizeMode.Multiple);
				}
				else
				{
					Console.WriteLine("Starting in console mode, enter phrases in the console:");

					Task.Run(() =>
					{
						while (true)
						{
							var result = recognizer.EmulateRecognize(Console.ReadLine());

							if (result != null)
							{
								Console.WriteLine(result.Text);
							}
						}
					});
				}
			}

			void SetupVoiceRecognizer()
			{
				recognizer = new SpeechRecognitionEngine(new CultureInfo(Config.Current.Language));

				// Create and load a dictation grammar.  
				//recognizer.LoadGrammar(new DictationGrammar());

				string filePath = Config.Current.GrammarFilePath;

				SrgsDocument doc = new SrgsDocument(filePath);

				Grammar grammar = new Grammar(doc);

				Console.WriteLine("Loaded Grammar: {0}", grammar.Name);

				recognizer.LoadGrammar(grammar);

				recognizer.SpeechRecognized += RecognizedSpeech;

				if (Config.Current.OverrideConfidence.HasValue)
				{
					recognizer.SpeechRecognitionRejected += RejectedSpeech;
				}
			}

			void RecognizedSpeech(object sender, SpeechRecognizedEventArgs e)
			{
				string text = e.Result.Text;

				HandleRecognisedVoice(text);
			}

			void RejectedSpeech(object sender, SpeechRecognitionRejectedEventArgs e)
			{
				string text = e.Result.Text;

				if (e.Result.Confidence > Config.Current.OverrideConfidence.Value)
				{
					HandleRecognisedVoice(text);
				}
				else
				{
					Console.WriteLine("Failed recognizing phrase: {0}, confidence: {1}", text, e.Result.Confidence);
				}
			}

			void HandleRecognisedVoice(string text)
			{
				string lowered = text.ToLowerInvariant();

				if (lowered == "quit")
				{
					Stop();

					return;
				}

				string processed = PreProcessVoice(lowered);

				Console.WriteLine("Raw Speech: {0} converted: {1}", text, processed);

				string message = "{{\"id\":{0},\"content\":\"{1}\"}}";

				string data = string.Format(message, count++, processed);

				webSocket.Send(data);
			}

			string PreProcessVoice(string text)
			{
				bool wasModified = false;

				string[] words = text.Split(' ');

				for (int i = 0; i < words.Length; i++)
				{
					if (aliases.TryGetValue(words[i], out Func<string, string> convert))
					{
						words[i] = convert(words[i]);

						wasModified = true;
					}
				}

				if (!wasModified)
				{
					return text;
				}

				return string.Join(" ", words);
			}

			public void Stop()
			{
				Console.WriteLine("Stopping...");

				StopRecordingVoice();

				cancellation.Cancel();
			}

			void StopRecordingVoice()
			{
				recognizer.SpeechRecognitionRejected -= RejectedSpeech;
				recognizer.SpeechRecognized -= RecognizedSpeech;

				recognizer.Dispose();
			}
		}
	}
}