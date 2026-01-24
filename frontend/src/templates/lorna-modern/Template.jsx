import React from "react";
import "./template.css";

const hasValue = value => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(entry => hasValue(entry));
  if (typeof value === "object") return Object.values(value).some(entry => hasValue(entry));
  return true;
};

function Section({ title, children }) {
  const contentArray = React.Children.toArray(children).filter(child => hasValue(child));
  if (!title || contentArray.length === 0) return null;

  return (
    <section className="lorna-section">
      <h3 className="section-title">{title}</h3>
      <div className="section-body">{contentArray}</div>
    </section>
  );
}

function BulletList({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <ul className="bullet-list">
      {items.map((item, index) => (
        <li key={`bullet-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

function ContentBlock({ value }) {
  if (!hasValue(value)) return null;

  if (Array.isArray(value)) {
    const primitives = value.every(entry => typeof entry === "string" || typeof entry === "number");
    if (primitives) return <BulletList items={value} />;
    return value.map((entry, idx) => <ContentBlock key={`block-${idx}`} value={entry} />);
  }

  if (typeof value === "string" || typeof value === "number") {
    return <p className="text-line">{value}</p>;
  }

  if (typeof value === "object") {
    const { title, subtitle, meta, description, text, bullets, items, lines } = value;
    return (
      <div className="item-block">
        {title && <div className="item-title">{title}</div>}
        {subtitle && <div className="item-subtitle">{subtitle}</div>}
        {meta && <div className="item-meta">{meta}</div>}
        {text && <p className="text-line">{text}</p>}
        {description && <p className="text-line">{description}</p>}
        {Array.isArray(lines) && lines.map((line, idx) => (
          <p className="text-line" key={`line-${idx}`}>{line}</p>
        ))}
        {Array.isArray(bullets) && bullets.length > 0 && <BulletList items={bullets} />}
        {Array.isArray(items) && items.length > 0 && <BulletList items={items} />}
      </div>
    );
  }

  return null;
}

export default function LornaModernTemplate({ data }) {
  if (!data) return null;

  const {
    name,
    title,
    contact,
    phone,
    email,
    location,
    leftSections = [],
    rightSections = [],
    customSections = [],
    rightCustomSections = []
  } = data;

  const contactItems = [
    ...(Array.isArray(contact) ? contact : contact ? [contact] : []),
    phone,
    email,
    location
  ].filter(hasValue);

  const allRightSections = [...(rightSections || []), ...(rightCustomSections || []), ...(customSections || [])];

  return (
    <div className="lorna-container" id="resume-preview-content">
      <header className="lorna-header">
        {hasValue(name) && <h1 className="lorna-name">{name}</h1>}
        {hasValue(title) && <h2 className="lorna-title">{title}</h2>}
      </header>

      {contactItems.length > 0 && (
        <div className="lorna-contact-bar">
          {contactItems.map((item, index) => (
            <div className="contact-item" key={`contact-${index}`}>
              <span className="contact-icon" aria-hidden="true" />
              <span className="contact-text">{item}</span>
            </div>
          ))}
        </div>
      )}

      <div className="lorna-body">
        <aside className="lorna-left">
          {(leftSections || []).filter(sec => sec && hasValue(sec.title) && hasValue(sec.content)).map((section, idx) => (
            <Section key={`left-${idx}`} title={section.title}>
              <ContentBlock value={section.content} />
            </Section>
          ))}
        </aside>

        <main className="lorna-right">
          {allRightSections
            .filter(sec => sec && hasValue(sec.title) && hasValue(sec.content))
            .map((section, idx) => (
              <Section key={`right-${idx}`} title={section.title}>
                <ContentBlock value={section.content} />
              </Section>
            ))}
        </main>
      </div>
    </div>
  );
}
