components/ui/card.tsx [31:39]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



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



components/ui/drawer.tsx [88:96]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



components/ui/empty.tsx [61:69]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



components/ui/input-otp.tsx [29:37]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



components/ui/item.tsx [146:154]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
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



