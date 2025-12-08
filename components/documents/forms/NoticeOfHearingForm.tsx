import React from "react";
import DocumentHeader from "../DocumentHeader";
import DocumentFooter from "../DocumentFooter";
import { Case, InvolvedParty, BarangaySettings, Hearing } from "@/types";

interface NoticeOfHearingFormProps {
  caseData: Case;
  complainants: InvolvedParty[];
  respondents: InvolvedParty[];
  settings: BarangaySettings;
  hearings?: Hearing[];
}

export default function NoticeOfHearingForm({
  caseData,
  complainants,
  respondents,
  settings,
  hearings = [],
}: NoticeOfHearingFormProps) {
  // Get the latest scheduled hearing
  const latestHearing = hearings
    .filter((h) => h.status === "Scheduled")
    .sort(
      (a, b) =>
        new Date(a.hearing_date).getTime() - new Date(b.hearing_date).getTime(),
    )[0];

  let day = "",
    monthYear = "",
    time = "";

  if (latestHearing) {
    const date = new Date(latestHearing.hearing_date);
    day = date.getDate().toString() + getOrdinalSuffix(date.getDate());
    monthYear = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    time = date.toLocaleTimeString("default", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function getOrdinalSuffix(i: number) {
    const j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return "st";
    }
    if (j == 2 && k != 12) {
      return "nd";
    }
    if (j == 3 && k != 13) {
      return "rd";
    }
    return "th";
  }

  return (
    <div className="max-w-[210mm] mx-auto p-8 bg-white min-h-screen text-black font-serif">
      <DocumentHeader settings={settings} />

      <div className="flex justify-between items-start mb-8">
        <div className="w-1/2">
          {complainants.map((c, i) => (
            <p key={i} className="font-bold uppercase">
              {c.name}
            </p>
          ))}
          <p className="text-sm italic">Complainant(s)</p>
          <p className="text-center my-2 font-bold">- against -</p>
          {respondents.map((r, i) => (
            <p key={i} className="font-bold uppercase">
              {r.name}
            </p>
          ))}
          <p className="text-sm italic">Respondent(s)</p>
        </div>
        <div className="w-1/2 text-right">
          <p>
            Barangay Case No.:{" "}
            <span className="font-bold">{caseData.case_number}</span>
          </p>
          <p>
            For: <span className="font-bold">{caseData.incident_type}</span>
          </p>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center uppercase mb-8 underline">
        NOTICE OF HEARING
      </h1>
      <p className="text-center text-sm mb-8 font-bold">(KP Form No. 8)</p>

      <div
        className="outline-none"
        contentEditable
        suppressContentEditableWarning
      >
        <p className="mb-4">
          TO:{" "}
          <span className="font-bold uppercase">
            {complainants.map((c) => c.name).join(", ")} /{" "}
            {respondents.map((r) => r.name).join(", ")}
          </span>
        </p>
        <p className="mb-4 text-justify indent-8 leading-relaxed">
          You are hereby required to appear before me on the
          <span className="inline-block w-32 border-b border-black mx-1 text-center font-bold px-2">
            {day}
          </span>{" "}
          day of
          <span className="inline-block w-32 border-b border-black mx-1 text-center font-bold px-2">
            {monthYear}
          </span>
          , 20__, at
          <span className="inline-block w-24 border-b border-black mx-1 text-center font-bold px-2">
            {time}
          </span>{" "}
          o&apos;clock in the morning/afternoon, for the hearing of your
          dispute.
        </p>
      </div>

      <DocumentFooter settings={settings} type="captain" />
    </div>
  );
}
