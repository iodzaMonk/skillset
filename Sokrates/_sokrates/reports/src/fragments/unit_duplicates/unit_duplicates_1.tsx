components/ui/dialog.tsx [77:85]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



components/ui/sheet.tsx [84:92]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



