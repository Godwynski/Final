import React from "react";
import DocumentHeader from "../DocumentHeader";
import DocumentFooter from "../DocumentFooter";

import { Case, InvolvedParty, BarangaySettings } from "@/types";

interface SummonsFormProps {
  caseData: Case;
  complainants: InvolvedParty[];
  respondents: InvolvedParty[];
  settings: BarangaySettings;
}

export default function SummonsForm({
  caseData,
  complainants,
  respondents,
  settings,
}: SummonsFormProps) {
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
        SUMMONS
      </h1>
      <p className="text-center text-sm mb-8 font-bold">(KP Form No. 9)</p>

      <div
        className="outline-none"
        contentEditable
        suppressContentEditableWarning
      >
        <p className="mb-4">
          TO:{" "}
          <span className="font-bold uppercase">
            {respondents.map((r) => r.name).join(", ")}
          </span>
        </p>
        <p className="mb-4 text-justify indent-8 leading-relaxed">
          You are hereby summoned to appear before me in person, together with
          your witnesses, on the
          <span className="inline-block w-32 border-b border-black mx-1"></span>{" "}
          day of
          <span className="inline-block w-32 border-b border-black mx-1"></span>
          , 20__, at
          <span className="inline-block w-24 border-b border-black mx-1"></span>{" "}
          o&apos;clock in the morning/afternoon, then and there to answer to a
          complaint made before me, copy of which is attached herewith, for
          mediation/conciliation of your dispute with complainant/s.
        </p>
        <p className="mb-8 text-justify indent-8 leading-relaxed">
          You are hereby warned that if you refuse or willfully fail to appear
          in obedience to this summons, you may be barred from filing any
          counterclaim arising from said complaint.
        </p>
        <p className="mb-8 text-justify indent-8 leading-relaxed">
          FAIL NOT or else face punishment for contempt of court.
        </p>
      </div>

      <DocumentFooter settings={settings} type="captain" />
    </div>
  );
}
