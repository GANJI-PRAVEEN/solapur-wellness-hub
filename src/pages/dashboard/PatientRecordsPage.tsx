import { useState } from "react";
import { FileText, Search, User, Eye, Download, Users, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MOCK_PATIENT_RECORDS = [
    { id: "PR-9921", patientName: "Rahul Desai", age: 45, ward: "Ward 3", docType: "MRI Scan", date: "2026-03-22", uploadedBy: "Patient" },
    { id: "PR-8812", patientName: "Ayesha Khan", age: 32, ward: "Ward 1", docType: "Blood Test Results", date: "2026-03-21", uploadedBy: "Patient" },
    { id: "PR-7753", patientName: "Sanjay Patil", age: 58, ward: "Ward 5", docType: "X-Ray Chest", date: "2026-03-20", uploadedBy: "Patient" },
    { id: "PR-6644", patientName: "Priya Sharma", age: 29, ward: "Ward 2", docType: "Lipid Profile", date: "2026-03-18", uploadedBy: "Patient" },
    { id: "PR-5535", patientName: "Anand Kulkarni", age: 61, ward: "Ward 4", docType: "ECG Report", date: "2026-03-15", uploadedBy: "Patient" },
];

export default function PatientRecordsPage() {
    const [search, setSearch] = useState("");

    const filteredRecords = MOCK_PATIENT_RECORDS.filter(record =>
        record.patientName.toLowerCase().includes(search.toLowerCase()) ||
        record.id.toLowerCase().includes(search.toLowerCase()) ||
        record.docType.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in-up">
                <div>
                    <h1 className="text-xl font-bold text-foreground mb-1">Patient Records</h1>
                    <p className="text-sm text-muted-foreground">Access health reports and scans uploaded directly by patients online.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card-hover rounded-xl bg-card border p-5 animate-in-up">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center mb-3">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">1,204</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Patients Online</p>
                </div>
                <div className="card-hover rounded-xl bg-card border p-5 animate-in-up animate-in-up-delay-1">
                    <div className="h-10 w-10 rounded-lg bg-info/10 flex flex-col items-center justify-center mb-3">
                        <ClipboardList className="h-5 w-5 text-info" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">3,892</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Total Reports Uploaded</p>
                </div>
                <div className="card-hover rounded-xl bg-card border p-5 animate-in-up animate-in-up-delay-2">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex flex-col items-center justify-center mb-3">
                        <FileText className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">156</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Uploaded This Week</p>
                </div>
            </div>

            <div className="card-hover rounded-xl bg-card border overflow-hidden animate-in-up">
                <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by patient name, ID, or report type..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/50 text-left">
                                <th className="p-4 font-medium text-muted-foreground">Patient Info</th>
                                <th className="p-4 font-medium text-muted-foreground">Document Type</th>
                                <th className="p-4 font-medium text-muted-foreground">Date Uploaded</th>
                                <th className="p-4 font-medium text-muted-foreground">Source</th>
                                <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((record) => (
                                <tr key={record.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{record.patientName}</p>
                                                <p className="text-xs text-muted-foreground">{record.id} • Age: {record.age} • {record.ward}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            {record.docType}
                                        </div>
                                    </td>
                                    <td className="p-4 tabular-nums">{record.date}</td>
                                    <td className="p-4">
                                        <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">
                                            {record.uploadedBy}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" className="h-8">
                                                <Eye className="h-3.5 w-3.5 mr-1" /> View
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRecords.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        No records found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
