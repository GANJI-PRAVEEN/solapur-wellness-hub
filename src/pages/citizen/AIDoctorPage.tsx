import { useState, useRef, useEffect } from "react";
import { PublicNav } from "@/components/PublicNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const RESPONSES: Record<string, string> = {
  fever: "For fever, here are some recommendations:\n\n• **Rest** and drink plenty of fluids (water, ORS, coconut water)\n• Take **Paracetamol 500mg** every 6-8 hours if temperature > 100°F\n• **Monitor** temperature regularly\n• If fever persists > 3 days, visit your nearest SMC health center\n• **Dengue alert**: If you're in Ward 3-5, get a dengue test done immediately\n\n⚠️ Seek emergency care if: high fever with rash, severe headache, or difficulty breathing",
  headache: "For headache, consider:\n\n• **Hydrate** well — dehydration is a common cause\n• Take **Paracetamol 500mg** if pain is moderate\n• Rest in a quiet, dark room\n• If accompanied by fever and body ache, get tested for dengue/malaria\n• **Visit a doctor** if headache is severe, sudden, or persists > 48 hours",
  cold: "For common cold / cough:\n\n• **Steam inhalation** 2-3 times daily\n• Warm fluids — tulsi tea, ginger water, kadha\n• **Cetirizine 10mg** for runny nose (available at SMC dispensaries)\n• Gargle with warm salt water for sore throat\n• If cough persists > 2 weeks, get a TB screening at your nearest PHC",
  stomach: "For stomach problems / gastroenteritis:\n\n• Start **ORS** immediately — available free at SMC dispensaries\n• **BRAT diet**: Bananas, Rice, Applesauce, Toast\n• Avoid spicy, oily food and street food\n• ⚠️ **Budhwar Peth area**: Water contamination reported — boil water before drinking\n• See a doctor if: blood in stool, severe dehydration, or symptoms > 2 days",
  default: "I understand your concern. Here's what I recommend:\n\n1. **Describe your symptoms** in more detail so I can help better\n2. For **emergencies**, call SMC Health Helpline: **0217-231-2345**\n3. You can also **book an appointment** with a specialist through our Appointments section\n\nTry asking about: fever, headache, cold, stomach problems, skin issues, or injury",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("fever") || lower.includes("bukhar")) return RESPONSES.fever;
  if (lower.includes("head") || lower.includes("migraine")) return RESPONSES.headache;
  if (lower.includes("cold") || lower.includes("cough") || lower.includes("sardi")) return RESPONSES.cold;
  if (lower.includes("stomach") || lower.includes("diarr") || lower.includes("vomit") || lower.includes("pet")) return RESPONSES.stomach;
  return RESPONSES.default;
}

export default function AIDoctorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Namaste! 🙏 I'm the SMC AI Health Assistant. Describe your symptoms and I'll provide basic guidance.\n\n**Note**: I provide general advice only. Always consult a real doctor for diagnosis and treatment." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    setMessages(prev => [...prev, { role: "assistant", content: getResponse(userMsg) }]);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNav />
      <div className="container flex-1 flex flex-col py-4 max-w-2xl">
        <div className="flex items-center gap-2 mb-4 animate-in-up">
          <div className="h-8 w-8 rounded-lg bg-info/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-info" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">AI Doctor</h1>
            <p className="text-xs text-muted-foreground">Symptom checker & basic health advice</p>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""} animate-in-up`}>
              {m.role === "assistant" && (
                <div className="h-7 w-7 rounded-full bg-info/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-3.5 w-3.5 text-info" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                  __html: m.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>")
                }} />
              </div>
              {m.role === "user" && (
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2 animate-in-up">
              <div className="h-7 w-7 rounded-full bg-info/10 flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5 text-info" />
              </div>
              <div className="bg-muted rounded-xl px-4 py-3 text-sm text-muted-foreground">
                Analyzing symptoms...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Describe your symptoms..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            disabled={isTyping}
          />
          <Button onClick={send} disabled={!input.trim() || isTyping} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
