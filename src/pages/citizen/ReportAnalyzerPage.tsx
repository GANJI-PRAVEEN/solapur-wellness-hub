import { useState } from "react";
import { PublicNav } from "@/components/PublicNav";
import { Button } from "@/components/ui/button";
import { FileText, Upload, CheckCircle, AlertTriangle } from "lucide-react";

interface AnalysisResult {
  title: string;
  findings: { label: string; value: string; status: "normal" | "warning" | "critical" }[];
  precautions: string[];
  diet: string[];
  nextSteps: string[];
}

const MOCK_RESULT: AnalysisResult = {
  title: "Complete Blood Count (CBC) Analysis",
  findings: [
    { label: "Hemoglobin", value: "11.2 g/dL", status: "warning" },
    { label: "WBC Count", value: "8,500 /µL", status: "normal" },
    { label: "Platelet Count", value: "1,20,000 /µL", status: "warning" },
    { label: "RBC Count", value: "4.5 million/µL", status: "normal" },
    { label: "ESR", value: "25 mm/hr", status: "warning" },
  ],
  precautions: [
    "Low platelet count detected — avoid injury, bruises, and heavy exercise",
    "Mild anemia indicated — increase iron-rich food intake",
    "Elevated ESR suggests possible infection or inflammation — follow up with doctor",
  ],
  diet: [
    "Iron-rich foods: spinach (palak), beetroot, pomegranate, jaggery (gul)",
    "Vitamin C foods to improve absorption: amla, lemon, oranges",
    "Protein: dal, eggs, paneer, sprouts",
    "Avoid: tea/coffee immediately after meals (blocks iron absorption)",
  ],
  nextSteps: [
    "Consult with a General Physician within 3-5 days",
    "Repeat CBC after 2 weeks to monitor platelet trend",
    "If any unusual bleeding or bruising, visit ER immediately",
    "Consider dengue NS1 test if you're in Ward 3-5 (dengue alert area)",
  ],
};

export default function ReportAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult(MOCK_RESULT);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="container py-6 max-w-2xl">
        <h1 className="text-xl font-bold text-foreground mb-1 animate-in-up">AI Report Analyzer</h1>
        <p className="text-sm text-muted-foreground mb-6 animate-in-up">Upload your test report for AI-powered analysis</p>

        {/* Upload */}
        {!result && (
          <div className="animate-in-up">
            <label className="block rounded-xl border-2 border-dashed border-border hover:border-primary/30 p-10 text-center cursor-pointer transition-colors">
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">{file ? file.name : "Click to upload report"}</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG (max 10MB)</p>
            </label>
            <Button onClick={handleUpload} disabled={!file || analyzing} className="w-full mt-4">
              {analyzing ? "Analyzing..." : "Analyze Report"}
            </Button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-5 animate-in-up">
            <div className="rounded-xl bg-card border p-5">
              <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                {result.title}
              </h2>
              <div className="space-y-2">
                {result.findings.map(f => (
                  <div key={f.label} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm">{f.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{f.value}</span>
                      {f.status === "normal" ? <CheckCircle className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: "⚠️ Precautions", items: result.precautions, color: "bg-warning/5 border-warning/20" },
              { title: "🥗 Recommended Diet", items: result.diet, color: "bg-success/5 border-success/20" },
              { title: "📋 Next Steps", items: result.nextSteps, color: "bg-info/5 border-info/20" },
            ].map(section => (
              <div key={section.title} className={`rounded-xl border ${section.color} p-5`}>
                <h3 className="font-semibold text-foreground mb-2">{section.title}</h3>
                <ul className="space-y-1.5">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <Button variant="outline" onClick={() => { setResult(null); setFile(null); }} className="w-full">
              Analyze Another Report
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
