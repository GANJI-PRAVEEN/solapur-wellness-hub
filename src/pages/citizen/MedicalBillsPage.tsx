import { useState } from "react";
import { PublicNav } from "@/components/PublicNav";
import { Receipt, DollarSign, Calendar, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_BILLS = [
    { id: "BILL-1042", type: "Consultation & Pharmacy", date: "2026-03-15", amount: "₹450", hospital: "SMC General Hospital", status: "Unpaid" },
    { id: "BILL-0981", type: "Pathology Tests", date: "2026-02-28", amount: "₹1200", hospital: "Ashwini Hospital", status: "Paid" },
    { id: "BILL-0855", type: "Routine Checkup", date: "2026-01-10", amount: "₹200", hospital: "SMC General Hospital", status: "Paid" },
];

export default function MedicalBillsPage() {
    const [paid, setPaid] = useState<Record<string, boolean>>({});

    const handlePay = (id: string) => {
        setPaid(prev => ({ ...prev, [id]: true }));
    };

    return (
        <div className="min-h-screen bg-background">
            <PublicNav />
            <div className="container py-6">
                <h1 className="text-xl font-bold text-foreground mb-1 animate-in-up">Medical Bills</h1>
                <p className="text-sm text-muted-foreground mb-6 animate-in-up">View and pay your hospital and treatment bills securely</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOCK_BILLS.map((bill, i) => {
                        const isPaid = bill.status === "Paid" || paid[bill.id];

                        return (
                            <div key={bill.id} className={`card-hover rounded-xl bg-card border p-5 flex flex-col gap-4 animate-in-up animate-in-up-delay-${i % 4}`}>
                                <div className="flex items-start justify-between">
                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${isPaid ? "bg-success/10" : "bg-destructive/10"}`}>
                                        <Receipt className={`h-5 w-5 ${isPaid ? "text-success" : "text-destructive"}`} />
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isPaid ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                                        {isPaid ? "Paid" : "Due"}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground text-lg">{bill.amount}</h3>
                                    <p className="font-medium text-sm mt-1">{bill.type}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Invoice: #{bill.id}</p>

                                    <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-4">
                                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {bill.date}</span>
                                        <span>Hospital: {bill.hospital}</span>
                                    </div>
                                </div>

                                {!isPaid ? (
                                    <Button className="w-full mt-2" onClick={() => handlePay(bill.id)}>
                                        <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                                    </Button>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 p-2 mt-2 bg-muted/50 rounded-md text-sm font-medium text-muted-foreground">
                                        <CheckCircle className="h-4 w-4 text-success" />
                                        Payment Settled
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
