import { CheckCircle2, Target } from 'lucide-react';
import { useUI, useUIState } from '@/context/UIContext';
import { useStickyValue } from '@/hooks/useStickyValue';
import { projects } from '@/data/projects';
import { serviceTitles } from '@/data/services';
import { isSafeUrl } from '@/lib/url';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ProjectVisual } from '@/components/visuals/ProjectVisual';
import './dialogs.css';

export default function ProjectDialog() {
  const { projectId } = useUIState();
  const { closeProject, openContact } = useUI();
  const id = useStickyValue(projectId);
  const project = projects.find((p) => p.id === id);

  const startSimilar = () => {
    if (!project) return;
    closeProject();
    openContact({
      service: project.services.find((s) => serviceTitles.includes(s)),
      message: `Hi Wolvo, I’m interested in discussing a project similar to the “${project.title}” case study. `,
      source: `case-study-${project.id}`,
    });
  };

  return (
    <Modal open={projectId !== null} onClose={closeProject} labelledBy="project-dialog-title" size="xl">
      {project && (
        <article className="project-dialog">
          <div className="project-dialog__visual">
            <ProjectVisual project={project} ratio="16 / 9" />
          </div>
          <div className="project-dialog__body">
            <div className="project-dialog__main">
              <div className="project-dialog__eyebrow-row">
                <span className="project-dialog__client-name">{project.client}</span>
                <span className="badge badge--accent">{project.category}</span>
              </div>
              <h2 id="project-dialog-title" className="project-dialog__title">
                {project.title}
              </h2>
              <p className="project-dialog__overview">{project.overview}</p>

              {project.result && (
                <div className="case-study__highlight">
                  <span className="case-study__stat-value">{project.result.metric}</span>
                  <span className="case-study__stat-label">{project.result.label}</span>
                </div>
              )}

              <div className="case-study__breakdown">
                <div className="case-study__card">
                  <div className="case-study__card-header">
                    <Target className="case-study__card-icon" strokeWidth={1.85} aria-hidden="true" />
                    <h3 className="case-study__card-title">The Challenge</h3>
                  </div>
                  <p className="case-study__card-body">{project.challenge}</p>
                </div>
                <div className="case-study__card">
                  <div className="case-study__card-header">
                    <CheckCircle2 className="case-study__card-icon is-success" strokeWidth={1.85} aria-hidden="true" />
                    <h3 className="case-study__card-title">Wolvo’s Solution</h3>
                  </div>
                  <p className="case-study__card-body">{project.solution}</p>
                </div>
              </div>
            </div>
            <aside className="project-dialog__aside" aria-label="Project details">
              <dl className="project-dialog__facts">
                <div>
                  <dt>Client</dt>
                  <dd>
                    <strong className="project-dialog__fact-highlight">{project.client}</strong>
                  </dd>
                </div>
                <div>
                  <dt>Services Delivered</dt>
                  <dd>
                    <ul className="tag-list">
                      {project.services.map((s) => (
                        <li key={s} className="badge">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt>Technologies Used</dt>
                  <dd>
                    <ul className="tag-list">
                      {project.technologies.map((t) => (
                        <li key={t} className="badge">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
              <div className="project-dialog__actions">
                <Button block onClick={startSimilar}>
                  Start a similar project
                </Button>
                {isSafeUrl(project.href) && (
                  <Button block variant="secondary" href={project.href} target="_blank" rel="noopener noreferrer" icon="arrow-up-right">
                    Visit live project
                  </Button>
                )}
              </div>
            </aside>
          </div>
        </article>
      )}
    </Modal>
  );
}
