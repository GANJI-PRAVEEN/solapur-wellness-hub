import { useState } from "react";
import { PublicNav } from "@/components/PublicNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Plus, Trash2, Clock } from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  time: string;
  type: "medicine" | "appointment" | "vaccination" | "custom";
  active: boolean;
}

const INITIAL: Reminder[] = [
  { id: "1", title: "Take Metformin 500mg", time: "08:00 AM, Daily", type: "medicine", active: true },
  { id: "2", title: "Blood pressure check - Dr. Kulkarni", time: "Mar 28, 10:00 AM", type: "appointment", active: true },
  { id: "3", title: "Pulse Polio - Child vaccination", time: "Mar 28, 08:00 AM", type: "vaccination", active: true },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const add = () => {
    if (!newTitle) return;
    setReminders(prev => [...prev, { id: crypto.randomUUID(), title: newTitle, time: newTime || "Not set", type: "custom", active: true }]);
    setNewTitle("");
    setNewTime("");
    setShowAdd(false);
  };

  const remove = (id: string) => setReminders(prev => prev.filter(r => r.id !== id));

  const TYPE_COLORS: Record<string, string> = {
    medicine: "bg-secondary/10 text-secondary",
    appointment: "bg-primary/10 text-primary",
    vaccination: "bg-warning/10 text-warning",
    custom: "bg-muted text-muted-foreground",
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="container py-6 max-w-lg">
        <div className="flex items-center justify-between mb-6 animate-in-up">
          <div>
            <h1 className="text-xl font-bold text-foreground">My Reminders</h1>
            <p className="text-sm text-muted-foreground">Medicine, follow-up & vaccination reminders</p>
          </div>
          <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>

        {showAdd && (
          <div className="rounded-xl bg-card border p-4 mb-4 space-y-3 animate-in-up">
            <Input placeholder="Reminder title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <Input placeholder="Time (e.g. 'Daily 8AM', 'Mar 30, 2PM')" value={newTime} onChange={e => setNewTime(e.target.value)} />
            <div className="flex gap-2">
              <Button size="sm" onClick={add}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {reminders.map((r, i) => (
            <div key={r.id} className={`flex items-center gap-3 rounded-xl bg-card border p-4 card-hover animate-in-up animate-in-up-delay-${i % 4}`}>
              <div className={`h-9 w-9 rounded-lg ${TYPE_COLORS[r.type]} flex items-center justify-center shrink-0`}>
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{r.time}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(r.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
