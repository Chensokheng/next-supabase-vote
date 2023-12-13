import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";

export default function EditSheet({
	trigger,
	editForm,
}: {
	trigger: ReactNode;
	editForm: ReactNode;
}) {
	return (
		<Sheet>
			<SheetTrigger asChild>{trigger}</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>
						Make changes to your profile here. Click save when youre
						done.
					</SheetDescription>
				</SheetHeader>
				{editForm}
			</SheetContent>
		</Sheet>
	);
}
