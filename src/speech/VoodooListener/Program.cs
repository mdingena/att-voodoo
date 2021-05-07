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
	class Program
	{
		public static void Main(string[] args)
		{
			string grammarFilePath = Path.GetFullPath(args[0]);
			Run(grammarFilePath).GetAwaiter().GetResult();
		}

		static async Task Run(string grammarFilePath)
		{
			while (true)
			{
				VoodooListener listener = new VoodooListener();

				try
				{
					await listener.ConnectAndListen(grammarFilePath);
				}
				catch (Exception e)
				{
					// Console.WriteLine(e.Message);
				}
			}
		}

		public class VoodooListener
		{
			static int count;

			SpeechRecognitionEngine recognizer;

			Dictionary<string, Func<string, string>> aliases = new Dictionary<string, Func<string, string>>();

			CancellationTokenSource cancellation = new CancellationTokenSource();

			public VoodooListener()
			{
				aliases.Add("everyone", _ => "*");
			}

			public async Task ConnectAndListen(string grammarFilePath)
			{
				SetupVoiceRecognizer(grammarFilePath);

				StartVoiceRecognition();

				// Console.WriteLine("Start Speaking, say quit to stop the application");

				await Task.Delay(-1, cancellation.Token);
			}

			void StartVoiceRecognition()
			{
					recognizer.SetInputToDefaultAudioDevice();
					recognizer.RecognizeAsync(RecognizeMode.Multiple);
			}

			void SetupVoiceRecognizer(string grammarFilePath)
			{
				recognizer = new SpeechRecognitionEngine(new CultureInfo("en-US"));

				SrgsDocument doc = new SrgsDocument(grammarFilePath);

				Grammar grammar = new Grammar(doc);

				// Console.WriteLine("Loaded Grammar: {0}", grammar.Name);

				recognizer.LoadGrammar(grammar);

				recognizer.SpeechRecognized += RecognizedSpeech;

				recognizer.SpeechRecognitionRejected += RejectedSpeech;
			}

			void RecognizedSpeech(object sender, SpeechRecognizedEventArgs e)
			{
				string text = e.Result.Text;

				HandleRecognisedVoice(text);
			}

			void RejectedSpeech(object sender, SpeechRecognitionRejectedEventArgs e)
			{
				string text = e.Result.Text;

				if (e.Result.Confidence > 1/*Config.Current.OverrideConfidence.Value*/)
				{
					HandleRecognisedVoice(text);
				}
				// else
				// {
				// 	Console.WriteLine("Failed recognizing phrase: {0}, confidence: {1}", text, e.Result.Confidence);
				// }
			}

			void HandleRecognisedVoice(string text)
			{
				string lowered = text.ToLowerInvariant();

				if (lowered == "quit")
				{
					Stop();

					return;
				}

				Console.Write(text);
			}

			public void Stop()
			{
				// Console.WriteLine("Stopping...");

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