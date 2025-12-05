components/ui/command.tsx [158:172]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



components/ui/dropdown-menu.tsx [179:193]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



components/ui/menubar.tsx [197:211]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



