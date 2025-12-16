components/ui/dialog.tsx [87:98]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



components/ui/alert.tsx [37:48]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



components/ui/card.tsx [5:16]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



components/ui/drawer.tsx [75:86]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
        className,
      )}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



components/ui/empty.tsx [5:16]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
        className,
      )}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



components/ui/field.tsx [44:55]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className,
      )}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



components/ui/item.tsx [106:117]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
        className,
      )}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



