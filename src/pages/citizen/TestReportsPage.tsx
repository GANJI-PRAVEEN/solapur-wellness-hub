import { useState, useRef } from "react";
import { PublicNav } from "@/components/PublicNav";
import { FileText, Download, Calendar, Eye, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Report = {
    id: string;
    type: string;
    date: string;
    hospital: string;
    doctor: string;
    status: string;
    fileUrl?: string;
};

const MOCK_REPORTS: Report[] = [
    { id: "REP-001", type: "Complete Blood Count", date: "2026-03-15", hospital: "SMC General Hospital", doctor: "Dr. Sharma", status: "Ready" },
    { id: "REP-002", type: "Chest X-Ray", date: "2026-02-28", hospital: "Ashwini Hospital", doctor: "Dr. Patil", status: "Ready" },
    { id: "REP-003", type: "Lipid Profile", date: "2026-01-10", hospital: "SMC General Hospital", doctor: "Dr. Deshpande", status: "Ready" },
];

export default function TestReportsPage() {
    const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
    const [isUploading, setIsUploading] = useState(false);
    const [fileTitle, setFileTitle] = useState("");
    const [fileUrl, setFileUrl] = useState<string | undefined>();
    const [showUploadForm, setShowUploadForm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        setTimeout(() => {
            const newReport: Report = {
                id: `REP-${Math.floor(Math.random() * 1000)}`,
                type: fileTitle || "Uploaded Medical Document",
                date: new Date().toISOString().split('T')[0],
                hospital: "Uploaded by Patient",
                doctor: "N/A",
                status: "Ready",
                fileUrl: fileUrl,
            };
            setReports([newReport, ...reports]);
            setIsUploading(false);
            setShowUploadForm(false);
            setFileTitle("");
            setFileUrl(undefined);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background">
            <PublicNav />
            <div className="container py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-foreground mb-1 animate-in-up">Test Reports & Scans</h1>
                        <p className="text-sm text-muted-foreground animate-in-up">Upload your latest medical reports securely online so doctors can view them anytime.</p>
                    </div>
                    <Button onClick={() => setShowUploadForm(!showUploadForm)} className="animate-in-up shrink-0">
                        <Upload className="h-4 w-4 mr-2" /> Upload New Report
                    </Button>
                </div>

                {showUploadForm && (
                    <div className="card-hover rounded-xl bg-card border p-5 mb-6 animate-in-up">
                        <form onSubmit={handleUpload} className="space-y-4 max-w-md">
                            <h3 className="font-semibold text-foreground">Upload Medical Document</h3>
                            <div className="space-y-2">
                                <Label>Document Name / Type</Label>
                                <Input
                                    placeholder="e.g. MRI Scan, Blood Test Result"
                                    value={fileTitle}
                                    onChange={(e) => setFileTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Select File (PDF, JPG, PNG)</Label>
                                <Input type="file" required accept=".pdf,.jpg,.jpeg,.png" className="cursor-pointer" ref={fileInputRef} onChange={handleFileChange} />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={isUploading || !fileUrl}>
                                    {isUploading ? "Uploading..." : "Submit Report"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {reports.map((report, i) => (
                        <div key={report.id} className={`card-hover rounded-xl bg-card border p-4 md:p-5 flex flex-col md:flex-row gap-4 animate-in-up animate-in-up-delay-${i % 4}`}>
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-foreground">{report.type}</h3>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">{report.status}</span>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {report.date}</span>
                                    <span>{report.hospital}</span>
                                    <span>Ref: {report.doctor}</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 md:self-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => report.fileUrl ? window.open(report.fileUrl, '_blank') : alert('View not available for this mockup.')}
                                >
                                    <Eye className="h-3.5 w-3.5 mr-1.5" /> View
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        if (report.fileUrl) {
                                            const a = document.createElement('a');
                                            a.href = report.fileUrl;
                                            a.download = `SMC_${report.type.replace(/\s+/g, '_')}`;
                                            a.click();
                                        } else {
                                            alert('Download not available for this mockup.');
                                        }
                                    }}
                                >
                                    <Download className="h-3.5 w-3.5 mr-1.5" /> Download
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
