import { useState } from "react";
import ReleaseCalendar from "../features/release/ReleaseCalendar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function ReleasePage() {
  const [country, setCountry] = useState("US");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-600">Movie Releases</h1>

      <div className="flex items-center gap-4 mb-6">
        <Select
          value={country}
          onValueChange={setCountry}
          className="border rounded p-2"
        >
          <SelectTrigger className="w-[180px] bg-gray-800 text-gray-300">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-gray-300">
            <SelectItem value="US">United States</SelectItem>
            <SelectItem value="KR">Korea</SelectItem>
            <SelectItem value="JP">Japan</SelectItem>
            <SelectItem value="FR">France</SelectItem>
            <SelectItem value="VI">Vietnam</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ReleaseCalendar country={country} />
    </div>
  );
}
