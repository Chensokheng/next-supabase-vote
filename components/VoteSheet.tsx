import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";
import VoteForm from "./VoteForm";

export default function VoteSheet({ trigger }: { trigger: ReactNode }) {
	return (
		<Sheet>
			<SheetTrigger asChild>{trigger}</SheetTrigger>
			<SheetContent className="min-h-screen">
				<div className=" space-y-10">
					<SheetHeader>
						<SheetTitle>New Vote</SheetTitle>
						<SheetDescription>
							Crearte a new vote with puclic access or unlist with
							private link.
						</SheetDescription>
					</SheetHeader>

					<VoteForm />
				</div>
			</SheetContent>
		</Sheet>
	);
}
