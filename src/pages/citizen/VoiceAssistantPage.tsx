import { useState, useRef } from "react";
import { PublicNav } from "@/components/PublicNav";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";

export default function VoiceAssistantPage() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);
  const recognitionRef = useRef<any>(null);

  const processCommand = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes("appointment") || lower.includes("book")) {
      return "You can book an appointment through the Appointments section. We have 8 doctors available across Solapur. Would you like me to navigate you there?";
    }
    if (lower.includes("bed") || lower.includes("hospital")) {
      return "Currently, SMC Civil Hospital has 34 general beds and 3 ICU beds available. District Hospital has 45 general and 5 ICU beds. Visit Hospital Resources for real-time updates.";
    }
    if (lower.includes("medicine") || lower.includes("dawai")) {
      return "You can check medicine stock at all SMC dispensaries through the Resources section. Paracetamol, ORS, and common medicines are well-stocked.";
    }
    if (lower.includes("dengue") || lower.includes("alert")) {
      return "Alert: Dengue cases are rising in Wards 3, 4, and 5. Please use mosquito nets, remove stagnant water, and visit a doctor if you have fever with body ache.";
    }
    if (lower.includes("vaccine") || lower.includes("campaign")) {
      return "Upcoming: Pulse Polio Drive on March 28 for children 0-5 years. Free Diabetes Screening on April 5 at Civil Hospital. You can register through Campaigns section.";
    }
    return "I can help you with: booking appointments, checking bed availability, medicine stock, health alerts, and vaccination campaigns. Try saying one of these.";
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setResponse("Voice recognition is not supported in your browser. Please use Chrome.");
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      const reply = processCommand(text);
      setResponse(reply);
      setHistory(prev => [{ q: text, a: reply }, ...prev]);
      speak(reply);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
    setTranscript("");
    setResponse("");
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="container py-8 max-w-lg">
        <div className="text-center mb-8 animate-in-up">
          <h1 className="text-xl font-bold text-foreground mb-1">Voice Assistant</h1>
          <p className="text-sm text-muted-foreground">Speak naturally to get health information</p>
        </div>

        {/* Mic button */}
        <div className="flex justify-center mb-8 animate-in-up">
          <button
            onClick={listening ? stopListening : startListening}
            className={`h-24 w-24 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              listening
                ? "hero-gradient shadow-xl animate-pulse"
                : "bg-muted hover:bg-muted/80 shadow-md"
            }`}
          >
            {listening ? <MicOff className="h-8 w-8 text-primary-foreground" /> : <Mic className="h-8 w-8 text-foreground" />}
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mb-6">
          {listening ? "Listening... speak now" : "Tap the mic and ask something"}
        </p>

        {/* Current */}
        {transcript && (
          <div className="rounded-xl bg-card border p-4 mb-3 animate-in-up">
            <p className="text-xs text-muted-foreground mb-1">You said:</p>
            <p className="text-sm font-medium text-foreground">{transcript}</p>
          </div>
        )}
        {response && (
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 mb-6 animate-in-up">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs text-primary font-medium">Response:</p>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{response}</p>
          </div>
        )}

        {/* Suggestions */}
        <div className="mb-6 animate-in-up">
          <p className="text-xs text-muted-foreground mb-2">Try saying:</p>
          <div className="flex flex-wrap gap-2">
            {["Book appointment for fever", "Check bed availability", "Any dengue alert?", "Upcoming vaccinations"].map(s => (
              <button key={s} onClick={() => { setTranscript(s); const r = processCommand(s); setResponse(r); setHistory(prev => [{ q: s, a: r }, ...prev]); speak(r); }}
                className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
                "{s}"
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        {history.length > 1 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">History:</p>
            {history.slice(1).map((h, i) => (
              <div key={i} className="rounded-lg bg-muted/50 p-3 text-xs">
                <p className="font-medium">Q: {h.q}</p>
                <p className="text-muted-foreground mt-1">{h.a.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
