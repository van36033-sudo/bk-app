import React, { useMemo, useState } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";

const serviceOptions = [
  { value: "individu", label: "Konseling Individu" },
  { value: "kelompok", label: "Konseling Kelompok" },
  { value: "klasikal", label: "Bimbingan Klasikal" },
  { value: "bimbingan_kelompok", label: "Bimbingan Kelompok" }
];

const templateDetails = {
  individu: {
    focus: "Pendekatan individual dan privasi siswa.",
    method: "Wawancara, konseling tatap muka, refleksi.",
    media: "Catatan konseling, lembar asesmen singkat."
  },
  kelompok: {
    focus: "Dinamis kelompok kecil dengan topik terfokus.",
    method: "Diskusi terarah, roleplay, studi kasus.",
    media: "Lembar kerja kelompok, papan tulis."
  },
  klasikal: {
    focus: "Penyampaian materi klasikal dalam kelas besar.",
    method: "Presentasi, tanya jawab, simulasi.",
    media: "Slide materi, video pendek."
  },
  bimbingan_kelompok: {
    focus: "Penguatan kompetensi sosial melalui kelompok besar.",
    method: "Ice breaking, diskusi, permainan edukatif.",
    media: "Kartu aktivitas, alat peraga."
  }
};

export default function RplGenerator() {
  const [serviceType, setServiceType] = useState("individu");
  const [form, setForm] = useState({
    title: "",
    counselor: "",
    student: "",
    className: "",
    date: "",
    goal: "",
    steps: "",
    evaluation: "",
    followUp: ""
  });

  const template = templateDetails[serviceType];

  const compiledText = useMemo(() => {
    return [
      `Jenis Layanan: ${
        serviceOptions.find((option) => option.value === serviceType)?.label
      }`,
      `Judul RPL: ${form.title}`,
      `Konselor: ${form.counselor}`,
      `Siswa/Kelompok: ${form.student}`,
      `Kelas: ${form.className}`,
      `Tanggal: ${form.date}`,
      `Tujuan Layanan: ${form.goal}`,
      `Fokus: ${template.focus}`,
      `Metode: ${template.method}`,
      `Media: ${template.media}`,
      `Langkah Kegiatan: ${form.steps}`,
      `Evaluasi: ${form.evaluation}`,
      `Tindak Lanjut: ${form.followUp}`
    ];
  }, [form, serviceType, template]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleDocx = async () => {
    const doc = new Document({
      sections: [
        {
          children: compiledText.map(
            (line) =>
              new Paragraph({
                children: [new TextRun({ text: line, font: "Calibri" })]
              })
          )
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `RPL-${serviceType}.docx`);
  };

  const handlePdf = () => {
    const pdf = new jsPDF();
    let y = 20;
    compiledText.forEach((line) => {
      pdf.text(line, 20, y);
      y += 10;
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });
    pdf.save(`RPL-${serviceType}.pdf`);
  };

  return (
    <div className="stack">
      <section className="card">
        <h3>Generator RPL</h3>
        <p className="muted">
          Form otomatis menyesuaikan jenis layanan BK dan menghasilkan dokumen
          RPL.
        </p>
        <form className="form-grid">
          <label>
            Jenis Layanan
            <select
              value={serviceType}
              onChange={(event) => setServiceType(event.target.value)}
            >
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Judul RPL
            <input value={form.title} onChange={handleChange("title")} />
          </label>
          <label>
            Nama Guru BK
            <input value={form.counselor} onChange={handleChange("counselor")} />
          </label>
          <label>
            Nama Siswa / Kelompok
            <input value={form.student} onChange={handleChange("student")} />
          </label>
          <label>
            Kelas
            <input value={form.className} onChange={handleChange("className")} />
          </label>
          <label>
            Tanggal
            <input type="date" value={form.date} onChange={handleChange("date")} />
          </label>
          <label>
            Tujuan Layanan
            <textarea value={form.goal} onChange={handleChange("goal")} rows={3} />
          </label>
          <label>
            Langkah Kegiatan
            <textarea
              value={form.steps}
              onChange={handleChange("steps")}
              rows={4}
            />
          </label>
          <label>
            Evaluasi
            <textarea
              value={form.evaluation}
              onChange={handleChange("evaluation")}
              rows={3}
            />
          </label>
          <label>
            Tindak Lanjut
            <textarea
              value={form.followUp}
              onChange={handleChange("followUp")}
              rows={3}
            />
          </label>
        </form>
        <div className="card-footer">
          <div className="hint">
            <strong>Template Otomatis:</strong>
            <p className="muted">Fokus: {template.focus}</p>
            <p className="muted">Metode: {template.method}</p>
            <p className="muted">Media: {template.media}</p>
          </div>
          <div className="button-group">
            <button className="btn" type="button" onClick={handleDocx}>
              Download DOC
            </button>
            <button className="btn secondary" type="button" onClick={handlePdf}>
              Download PDF
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
