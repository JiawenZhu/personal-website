import { useEffect, useState, type ReactNode } from "react";
import { AlertCircle, BriefcaseBusiness, ExternalLink, FileDown, Loader2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import {
  type CareerVividResume,
  fetchCareerVividResume,
  downloadCareerVividResumePdf,
} from "../lib/careervividResume";

type ResumeState =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: CareerVividResume; error: null }
  | { status: "error"; data: null; error: string };

const formatPeriod = (startDate: string | null, endDate: string | null) => {
  if (!startDate && !endDate) return "Timeline unavailable";
  if (!startDate) return endDate || "Present";
  return `${startDate} - ${endDate || "Present"}`;
};

const cleanDisplayText = (text: string) => text.replace(/\s&&\s/g, " & ").replace(/\*/g, "");

const renderInlineStrong = (text: string | null): ReactNode => {
  if (!text) return null;

  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{cleanDisplayText(part.slice(2, -2))}</strong>;
    }

    return cleanDisplayText(part);
  });
};

const parseSkill = (skillName: string) => {
  const [category, ...rest] = skillName.split(":");

  return {
    category: rest.length ? category.trim() : "Core Capability",
    details: rest.length ? rest.join(":").trim() : skillName.trim(),
  };
};

export function Experience() {
  const [resumeState, setResumeState] = useState<ResumeState>({
    status: "loading",
    data: null,
    error: null,
  });

  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "error">("idle");
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownloadPdf = async (userId: string, resumeId: string) => {
    setDownloadState("loading");
    setDownloadError(null);
    try {
      await downloadCareerVividResumePdf(userId, resumeId);
      setDownloadState("idle");
    } catch (err: any) {
      setDownloadState("error");
      setDownloadError(err.message || "Failed to download resume PDF.");
    }
  };


  useEffect(() => {
    const controller = new AbortController();

    fetchCareerVividResume({ signal: controller.signal })
      .then((resume) => {
        setResumeState({ status: "success", data: resume, error: null });
      })
      .catch((error: Error) => {
        if (controller.signal.aborted) return;
        setResumeState({
          status: "error",
          data: null,
          error: error.message || "Unable to load CareerVivid resume data.",
        });
      });

    return () => controller.abort();
  }, []);

  return (
    <section id="experience" className="section container" aria-labelledby="experience-heading">
      <div className="section-header experience-heading">
        <div>
          <a
            className="section-kicker experience-source-link"
            href="https://careervivid.app/"
            target="_blank"
            rel="noreferrer"
            aria-label="Create your own resume on CareerVivid"
          >
            <span>Live CareerVivid Resume</span>
            <ExternalLink size={13} aria-hidden="true" />
          </a>
          <h2 id="experience-heading">Professional Experience</h2>
        </div>
        {resumeState.status === "success" && resumeState.data.updatedAt && (
          <p className="experience-updated">
            Updated {new Date(resumeState.data.updatedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      {resumeState.status === "loading" && (
        <div className="experience-status" role="status" aria-live="polite">
          <Loader2 className="status-icon spinning" size={22} aria-hidden="true" />
          <span>Loading CareerVivid resume data...</span>
        </div>
      )}

      {resumeState.status === "error" && (
        <div className="experience-status error" role="alert">
          <AlertCircle className="status-icon" size={22} aria-hidden="true" />
          <div>
            <strong>Experience is temporarily unavailable.</strong>
            <p>{resumeState.error}</p>
          </div>
        </div>
      )}

      {resumeState.status === "success" && resumeState.data.experience.length === 0 && (
        <div className="experience-status" role="status">
          <BriefcaseBusiness className="status-icon" size={22} aria-hidden="true" />
          <span>No experience entries are published in this resume yet.</span>
        </div>
      )}

      {resumeState.status === "success" && resumeState.data.experience.length > 0 && (
        <div className="experience-layout">
          <div className="experience-summary" aria-label="Resume profile summary">
            <div className="experience-summary-card">
              <div className="experience-summary-label">Profile Snapshot</div>
              <p>{renderInlineStrong(resumeState.data.profile.summary)}</p>
              <div className="experience-summary-actions">
                <a
                  className="resume-builder-link"
                  href="https://careervivid.app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Create your own AI resume</span>
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
                <button
                  className="resume-download-btn"
                  onClick={() => handleDownloadPdf(resumeState.data.userId, resumeState.data.id)}
                  disabled={downloadState === "loading"}
                >
                  {downloadState === "loading" ? (
                    <>
                      <Loader2 className="status-icon spinning" size={15} aria-hidden="true" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <FileDown size={15} aria-hidden="true" />
                      <span>Download Resume (PDF)</span>
                    </>
                  )}
                </button>
              </div>

              {downloadState === "error" && downloadError && (
                <div className="download-error-notice" role="alert">
                  <span>{downloadError}</span>
                  <button
                    className="dismiss-error-btn"
                    onClick={() => {
                      setDownloadState("idle");
                      setDownloadError(null);
                    }}
                    aria-label="Dismiss error"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            <div className="experience-skill-list" aria-label="Core skills">
              {resumeState.data.skills.slice(0, 10).map((skill) => (
                <div className="experience-skill-row" key={skill.name}>
                  <span className="experience-skill-category">{parseSkill(skill.name).category}</span>
                  <span className="experience-skill-details">{parseSkill(skill.name).details}</span>
                </div>
              ))}
            </div>
          </div>

          <ol className="experience-timeline" aria-label="Work history">
            {resumeState.data.experience.map((item, index) => (
              <motion.li
                key={`${item.company}-${item.title}-${index}`}
                className="experience-item"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <div className="experience-header">
                  <div>
                    <h3>{cleanDisplayText(item.title)}</h3>
                    <div className="company">{item.company}</div>
                  </div>
                  <span className="period">{formatPeriod(item.startDate, item.endDate)}</span>
                </div>

                {item.location && (
                  <div className="experience-location">
                    <MapPin size={14} aria-hidden="true" />
                    <span>{item.location}</span>
                  </div>
                )}

                {item.bullets.length > 0 && (
                  <ul className="experience-bullets">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{renderInlineStrong(bullet)}</li>
                    ))}
                  </ul>
                )}
              </motion.li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
