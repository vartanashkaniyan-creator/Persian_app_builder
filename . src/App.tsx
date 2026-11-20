import { useEffect, useState } from "react";
import "./App.css";

type Project = {
  id: number;
  name: string;
  updatedAt: string;
};

const STORAGE_KEY = "farsi-app-builder-projects";

function readProjects(): Project[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Project[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>(readProjects);
  const [showDialog, setShowDialog] = useState(false);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  function createProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = projectName.trim();
    if (!name) return;

    const newProject: Project = {
      id: Date.now(),
      name,
      updatedAt: new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "medium",
      }).format(new Date()),
    };

    setProjects((current) => [newProject, ...current]);
    setProjectName("");
    setShowDialog(false);
  }

  function deleteProject(id: number) {
    const confirmed = window.confirm("این پروژه حذف شود؟");
    if (confirmed) {
      setProjects((current) =>
        current.filter((project) => project.id !== id)
      );
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">ا</div>
          <div>
            <strong>اپ‌ساز</strong>
            <span>محیط ساخت برنامه</span>
          </div>
        </div>

        <nav className="navigation" aria-label="منوی اصلی">
          <a className="nav-item active" href="#home">⌂ <span>خانه</span></a>
          <a className="nav-item" href="#projects">▦ <span>پروژه‌های من</span></a>
          <a className="nav-item" href="#guide">؟ <span>راهنما</span></a>
        </nav>

        <div className="sidebar-note">
          <span className="note-icon">✦</span>
          <strong>قدم‌به‌قدم بساز</strong>
          <p>اینجا قرار است ایده‌هایت را به برنامه‌های ساده تبدیل کنی.</p>
        </div>

        <div className="sidebar-footer">نسخه آزمایشی ۰.۱</div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <div>
            <p className="eyebrow">فضای کاری شخصی</p>
            <h1>سلام! خوش آمدی</h1>
          </div>
          <div className="profile-badge">کاربر</div>
        </header>

        <section className="welcome-card">
          <div className="welcome-copy">
            <span className="tag">شروع ساخت</span>
            <h2>ایده‌ات را به یک برنامه تبدیل کن.</h2>
            <p>
              یک پروژه بساز؛ بعد می‌توانیم صفحه‌ها، دکمه‌ها و منطق برنامه را
              به آن اضافه کنیم.
            </p>
            <button
              className="primary-button"
              onClick={() => setShowDialog(true)}
            >
              <span>＋</span> ساخت پروژه جدید
            </button>
          </div>

          <div className="welcome-illustration">
            <div className="mock-window">
              <div className="mock-dots"><i /><i /><i /></div>
              <div className="mock-line wide" />
              <div className="mock-line" />
              <div className="mock-button" />
            </div>
            <div className="sparkle">✦</div>
          </div>
        </section>

        <section className="projects-section" id="projects">
          <div className="section-heading">
            <div>
              <h2>پروژه‌های من</h2>
              <p>پروژه‌هایی که ساخته‌ای در این قسمت نمایش داده می‌شوند.</p>
            </div>
            <span className="count-badge">{projects.length} پروژه</span>
          </div>

          {projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▧</div>
              <h3>هنوز پروژه‌ای نساخته‌ای</h3>
              <p>برای شروع، اولین پروژه‌ات را ایجاد کن.</p>
              <button
                className="secondary-button"
                onClick={() => setShowDialog(true)}
              >
                ساخت اولین پروژه
              </button>
            </div>
          ) : (
            <div className="project-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.id}>
                  <div className="project-card-top">
                    <div className="project-icon">▦</div>
                    <button
                      className="delete-button"
                      onClick={() => deleteProject(project.id)}
                      aria-label={`حذف ${project.name}`}
                      title="حذف پروژه"
                    >
                      ⋯
                    </button>
                  </div>
                  <h3>{project.name}</h3>
                  <p>آخرین تغییر: {project.updatedAt}</p>
                  <span className="project-status">
                    پروژه تازه ایجادشده
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="next-step" id="guide">
          <div className="next-icon">➜</div>
          <div>
            <strong>مرحله بعدی چیست؟</strong>
            <p>
              در نسخه‌های بعدی، ویرایشگر بصری و ابزارهای ساخت صفحه را اضافه
              می‌کنیم.
            </p>
          </div>
        </section>
      </main>

      {showDialog && (
        <div
          className="dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowDialog(false);
            }
          }}
        >
          <form className="dialog" onSubmit={createProject}>
            <button
              type="button"
              className="dialog-close"
              onClick={() => setShowDialog(false)}
              aria-label="بستن"
            >
              ×
            </button>

            <span className="tag">پروژه تازه</span>
            <h2>نام پروژه را وارد کن</h2>
            <p>بعداً می‌توانی نام آن را تغییر بدهی.</p>

            <label htmlFor="project-name">نام پروژه</label>
            <input
              id="project-name"
              autoFocus
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="مثلاً دفترچه یادداشت من"
              maxLength={50}
            />

            <div className="dialog-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowDialog(false)}
              >
                انصراف
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={!projectName.trim()}
              >
                ایجاد پروژه
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
      }
