import {
	Sheet,
	SheetContent,
	SheetDescription,
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
						Your change may not update immediately due to the speed
						of revalidate page📌.
					</SheetDescription>
				</SheetHeader>
				{editForm}
			</SheetContent>
		</Sheet>
	);
}
