import { Datepicker } from "flowbite-react";
import { format } from "date-fns";

interface BirthdayPickerProps {
  birthday: Date | null;
  setBirthday: (date: Date | null) => void;
  error?: string | null;
}

export function BirthdayPicker({
  birthday,
  setBirthday,
  error,
}: BirthdayPickerProps) {
  return (
    <>
      <Datepicker
        id="datepicker"
        onChange={setBirthday}
        value={birthday ?? undefined}
      />
      <input
        type="hidden"
        name="birthday"
        value={birthday ? format(birthday, "yyyy-MM-dd") : ""}
      />

      {error ? <p className="text-red-600">{error}</p> : null}
    </>
  );
}
