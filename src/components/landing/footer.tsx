import Link from "next/link";
import { CircleDollarSign } from "lucide-react";

export default function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t">
            <div className="container mx-auto py-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-6 w-6 text-primary" />
                    <span className="font-bold">BemPay</span>
                    <span className="text-muted-foreground">&copy; {currentYear}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                    <Link href="#" className="text-muted-foreground hover:text-foreground">Confidentialité</Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">Conditions</Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link>
                </div>
            </div>
        </footer>
    );
}
