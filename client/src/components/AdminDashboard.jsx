import { Plus, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import { fileToDataUrl } from '../services/portfolioStorage'

function summarizeImageValue(value) {
  if (!value) return 'No image selected'
  if (value.startsWith('data:')) return 'Embedded local image'
  if (value.startsWith('/')) return `Bundled asset: ${value.split('/').pop()}`
  if (value.startsWith('http')) return 'Uploaded image URL'
  return value.length > 64 ? `${value.slice(0, 64)}…` : value
}

function AdminDashboard({ content, onChange, onReset, onBack, onLogout, saveMeta, onSaveNow, currentUser, firebaseDebug }) {
  const [uploadingKey, setUploadingKey] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [preferEmbeddedImages, setPreferEmbeddedImages] = useState(() => window.sessionStorage.getItem('prefer-embedded-images') === '1')
  const saveStatus = saveMeta?.saveStatus || 'idle'
  const saveError = saveMeta?.saveError || ''
  const lastSavedAt = saveMeta?.lastSavedAt

  const saveStatusText =
    saveStatus === 'saving'
      ? 'Saving...'
      : saveStatus === 'saved'
        ? `Saved${lastSavedAt ? ` at ${new Date(lastSavedAt).toLocaleTimeString()}` : ''}`
        : saveStatus === 'error'
          ? 'Save error (local backup active)'
          : 'Idle'
  const updateHero = (field, value) => {
    onChange((current) => ({
      ...current,
      hero: {
        ...current.hero,
        [field]: value,
      },
    }))
  }

  const updateIntroduction = (field, value) => {
    onChange((current) => ({
      ...current,
      introduction: {
        ...current.introduction,
        [field]: value,
      },
    }))
  }

  const updateHighlight = (id, field, value) => {
    onChange((current) => ({
      ...current,
      introduction: {
        ...current.introduction,
        highlights: current.introduction.highlights.map((highlight) =>
          highlight.id === id ? { ...highlight, [field]: value } : highlight,
        ),
      },
    }))
  }

  const addHighlight = () => {
    onChange((current) => ({
      ...current,
      introduction: {
        ...current.introduction,
        highlights: [
          ...current.introduction.highlights,
          {
            id: `intro-highlight-${Date.now()}`,
            label: 'New point',
            description: 'Describe the portfolio focus here.',
          },
        ],
      },
    }))
  }

  const removeHighlight = (id) => {
    onChange((current) => ({
      ...current,
      introduction: {
        ...current.introduction,
        highlights: current.introduction.highlights.filter((highlight) => highlight.id !== id),
      },
    }))
  }

  const updateStat = (index, field, value) => {
    onChange((current) => {
      const stats = current.stats.map((stat, statIndex) =>
        statIndex === index ? { ...stat, [field]: value } : stat,
      )
      return { ...current, stats }
    })
  }

  const addStat = () => {
    onChange((current) => ({
      ...current,
      stats: [...current.stats, { id: `stat-${Date.now()}`, value: '00+', label: 'New stat' }],
    }))
  }

  const removeStat = (id) => {
    onChange((current) => ({ ...current, stats: current.stats.filter((stat) => stat.id !== id) }))
  }

  const updateProject = (id, field, value) => {
    onChange((current) => ({
      ...current,
      projects: current.projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)),
    }))
  }

  const addProject = () => {
    onChange((current) => ({
      ...current,
      projects: [
        ...current.projects,
        {
          id: `project-${Date.now()}`,
          title: 'New Project',
          summary: 'Describe the project here.',
          imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
          tag: 'Web',
          url: '',
          gitRepoUrl: '',
        },
      ],
    }))
  }

  const removeProject = (id) => {
    onChange((current) => ({ ...current, projects: current.projects.filter((project) => project.id !== id) }))
  }

  const updateCertificate = (id, field, value) => {
    onChange((current) => ({
      ...current,
      certificates: current.certificates.map((certificate) =>
        certificate.id === id ? { ...certificate, [field]: value } : certificate,
      ),
    }))
  }

  const updateCertificateCategory = (id, value) => {
    updateCertificate(id, 'category', value)
  }

  const addCertificate = () => {
    onChange((current) => ({
      ...current,
      certificates: [
        ...current.certificates,
        {
          id: `certificate-${Date.now()}`,
          title: 'New Certificate',
          issuer: 'Issuer',
          date: '2026',
          category: 'coding',
          imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
        },
      ],
    }))
  }

  const removeCertificate = (id) => {
    onChange((current) => ({ ...current, certificates: current.certificates.filter((certificate) => certificate.id !== id) }))
  }

  const updateUiSetting = (field, value) => {
    onChange((current) => ({
      ...current,
      uiSettings: {
        ...current.uiSettings,
        [field]: value,
      },
    }))
  }

  const updateFooter = (field, value) => {
    onChange((current) => ({
      ...current,
      footer: {
        ...current.footer,
        [field]: value,
      },
    }))
  }

  const updateAbout = (field, value) => {
    onChange((current) => ({
      ...current,
      about: {
        ...current.about,
        [field]: value,
      },
    }))
  }

  const updateAboutFavorites = (field, value) => {
    onChange((current) => ({
      ...current,
      about: {
        ...current.about,
        favorites: {
          ...current.about.favorites,
          [field]: value,
        },
      },
    }))
  }

const uploadToImgBB = async (file) => {
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=48996910d06996fd177948a1affc2a69`,
    {
      method: 'POST',
      body: formData,
    }
  )

  const data = await res.json()
  return data.data.url
}

  const uploadImage = async ({ file, path, onSuccess, key }) => {
    if (!file) return

    setUploadError('')
    setUploadingKey(key)

    if (false) {
      try {
        const embeddedUrl = await fileToDataUrl(file)
        onSuccess(embeddedUrl)
      } catch (fallbackError) {
        const code = fallbackError?.code ? ` (${fallbackError.code})` : ''
        const message = fallbackError?.message || 'Unknown image processing error.'
        setUploadError(`Embedded image failed${code}: ${message}`)
      } finally {
        setUploadingKey('')
      }
      return
    }

    try {
  const url = await uploadToImgBB(file)
  onSuccess(url)
    }
    catch (error) {
      console.error(error)
    try {
        const fallbackUrl = await fileToDataUrl(file)
        onSuccess(fallbackUrl)


        const code = error?.code ? ` (${error.code})` : ''
        const message = error?.message || 'Unknown upload error.'
        setUploadError(`Storage upload failed${code}: ${message}. Switched to fast embedded-image mode for this session.`)
      } catch (fallbackError) {
        const code = fallbackError?.code ? ` (${fallbackError.code})` : ''
        const message = fallbackError?.message || 'Unknown image processing error.'
        setUploadError(`Image upload failed and fallback failed${code}: ${message}`)
      }
    } finally {
      setUploadingKey('')
    }
  }

  const uploadSound = async (file) => {
    if (!file) return

    setUploadError('')
    setUploadingKey('ui-sound')

    try {
      const soundDataUrl = await fileToDataUrl(file)
      updateUiSetting('soundCustomUrl', soundDataUrl)
      updateUiSetting('soundSource', 'custom')
    } catch (error) {
      const code = error?.code ? ` (${error.code})` : ''
      const message = error?.message || 'Unknown audio processing error.'
      setUploadError(`Sound upload failed${code}: ${message}`)
    } finally {
      setUploadingKey('')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-topbar glass-frame">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Edit the portfolio content</h1>
          <p className="section-subtitle">Change the profile card, title, stats, project cards, and certificate stack here.</p>
          <p className="section-subtitle">
            Signed in as: {currentUser?.email || 'Not signed in'}
          </p>
          <p className="section-subtitle">
            UID: {currentUser?.uid || '-'} | Project: {firebaseDebug?.projectId || '-'} | Bucket: {firebaseDebug?.storageBucket || '-'}
          </p>
        </div>
        <div className="admin-actions">
          <span className={`save-pill save-pill--${saveStatus}`}>{saveStatusText}</span>
          <button type="button" className="primary-button" onClick={onSaveNow} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? 'Saving...' : 'Save now'}
          </button>
          <button type="button" className="secondary-button" onClick={onBack}>
            Back to site
          </button>
          <button type="button" className="secondary-button" onClick={onLogout}>
            Logout
          </button>
          <button type="button" className="secondary-button" onClick={onReset}>
            Reset content
          </button>
        </div>
        {saveStatus === 'error' && <p className="save-error-text">{saveError}</p>}
        {uploadError && <p className="save-error-text">{uploadError}</p>}
      </div>

      <div className="admin-grid">
        <section className="glass-frame admin-panel">
          <h2>Hero card</h2>
          <div className="admin-form-grid">
            <label>
              Name
              <input value={content.hero.name} onChange={(event) => updateHero('name', event.target.value)} />
            </label>
            <label>
              Title
              <input value={content.hero.title} onChange={(event) => updateHero('title', event.target.value)} />
            </label>
            <label className="span-2">
              Page title
              <input value={content.hero.pageTitle} onChange={(event) => updateHero('pageTitle', event.target.value)} />
            </label>
            <label>
              Handle
              <input value={content.hero.handle} onChange={(event) => updateHero('handle', event.target.value)} />
            </label>
            <label>
              Status
              <input value={content.hero.status} onChange={(event) => updateHero('status', event.target.value)} />
            </label>
            <label className="span-2">
              Summary
              <textarea rows="4" value={content.hero.summary} onChange={(event) => updateHero('summary', event.target.value)} />
            </label>
            <label>
              Avatar image
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  uploadImage({
                    file: event.target.files?.[0],
                    path: 'portfolio/hero/avatar',
                    key: 'hero-avatar',
                    onSuccess: (url) => updateHero('avatarUrl', url),
                  })
                }
              />
              <div className="admin-image-preview-row">
                <div className="admin-image-preview">
                  {content.hero.avatarUrl ? <img src={content.hero.avatarUrl} alt="Hero avatar preview" /> : <span>No preview</span>}
                </div>
                <small>{uploadingKey === 'hero-avatar' ? 'Uploading...' : summarizeImageValue(content.hero.avatarUrl)}</small>
              </div>
            </label>
            <label>
              Mini avatar image
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  uploadImage({
                    file: event.target.files?.[0],
                    path: 'portfolio/hero/mini-avatar',
                    key: 'hero-mini-avatar',
                    onSuccess: (url) => updateHero('miniAvatarUrl', url),
                  })
                }
              />
              <div className="admin-image-preview-row">
                <div className="admin-image-preview">
                  {content.hero.miniAvatarUrl ? <img src={content.hero.miniAvatarUrl} alt="Mini avatar preview" /> : <span>No preview</span>}
                </div>
                <small>{uploadingKey === 'hero-mini-avatar' ? 'Uploading...' : summarizeImageValue(content.hero.miniAvatarUrl)}</small>
              </div>
            </label>
            <label>
              Contact button
              <input value={content.hero.contactText} onChange={(event) => updateHero('contactText', event.target.value)} />
            </label>
          </div>
        </section>

        <section className="glass-frame admin-panel">
          <div className="section-heading-row section-heading-row--compact">
            <h2>Stats</h2>
            <button type="button" className="secondary-button" onClick={addStat}>
              <Plus size={16} /> Add stat
            </button>
          </div>
          <div className="stack-list">
            {content.stats.map((stat, index) => (
              <div key={stat.id} className="stack-row">
                <input value={stat.value} onChange={(event) => updateStat(index, 'value', event.target.value)} />
                <input value={stat.label} onChange={(event) => updateStat(index, 'label', event.target.value)} />
                <button type="button" className="icon-button" onClick={() => removeStat(stat.id)} aria-label="Remove stat">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-frame admin-panel admin-panel-wide">
          <div className="section-heading-row section-heading-row--compact">
            <h2>Introduction</h2>
          </div>
          <div className="admin-form-grid admin-form-grid--projects">
            <label>
              Eyebrow
              <input value={content.introduction.eyebrow} onChange={(event) => updateIntroduction('eyebrow', event.target.value)} />
            </label>
            <label className="span-2">
              Title
              <input value={content.introduction.title} onChange={(event) => updateIntroduction('title', event.target.value)} />
            </label>
            <label className="span-2">
              Summary
              <textarea rows="4" value={content.introduction.summary} onChange={(event) => updateIntroduction('summary', event.target.value)} />
            </label>
          </div>
          <div className="section-heading-row section-heading-row--compact">
            <h3>Highlights</h3>
            <button type="button" className="secondary-button" onClick={addHighlight}>
              <Plus size={16} /> Add highlight
            </button>
          </div>
          <div className="stack-list">
            {content.introduction.highlights.map((highlight) => (
              <div key={highlight.id} className="admin-card-editor">
                <div className="admin-form-grid admin-form-grid--projects">
                  <label>
                    Label
                    <input value={highlight.label} onChange={(event) => updateHighlight(highlight.id, 'label', event.target.value)} />
                  </label>
                  <label className="span-2">
                    Description
                    <textarea rows="3" value={highlight.description} onChange={(event) => updateHighlight(highlight.id, 'description', event.target.value)} />
                  </label>
                </div>
                <button type="button" className="icon-button icon-button--danger" onClick={() => removeHighlight(highlight.id)}>
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-frame admin-panel admin-panel-wide">
          <div className="section-heading-row section-heading-row--compact">
            <h2>Projects</h2>
            <button type="button" className="secondary-button" onClick={addProject}>
              <Plus size={16} /> Add project
            </button>
          </div>
          <div className="stack-list">
            {content.projects.map((project) => (
              <div key={project.id} className="admin-card-editor">
                <div className="admin-form-grid admin-form-grid--projects">
                  <label>
                    Title
                    <input value={project.title} onChange={(event) => updateProject(project.id, 'title', event.target.value)} />
                  </label>
                  <label>
                    Tag
                    <input value={project.tag} onChange={(event) => updateProject(project.id, 'tag', event.target.value)} />
                  </label>
                  <label className="span-2">
                    Project URL (leave empty if not assigned)
                    <input 
                      type="url" 
                      placeholder="https://example.com" 
                      value={project.url || ''} 
                      onChange={(event) => updateProject(project.id, 'url', event.target.value)} 
                    />
                  </label>
                  <label className="span-2">
                    Git Repository URL
                    <input 
                      type="url" 
                      placeholder="https://github.com/user/repo" 
                      value={project.gitRepoUrl || ''} 
                      onChange={(event) => updateProject(project.id, 'gitRepoUrl', event.target.value)} 
                    />
                  </label>
                  <label className="span-2">
                    Summary
                    <textarea rows="3" value={project.summary} onChange={(event) => updateProject(project.id, 'summary', event.target.value)} />
                  </label>
                  <label className="span-2">
                    Project image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        uploadImage({
                          file: event.target.files?.[0],
                          path: `portfolio/projects/${project.id}`,
                          key: `project-${project.id}`,
                          onSuccess: (url) => updateProject(project.id, 'imageUrl', url),
                        })
                      }
                    />
                    <div className="admin-image-preview-row">
                      <div className="admin-image-preview">
                        {project.imageUrl ? <img src={project.imageUrl} alt={`${project.title} preview`} /> : <span>No preview</span>}
                      </div>
                      <small>{uploadingKey === `project-${project.id}` ? 'Uploading...' : summarizeImageValue(project.imageUrl)}</small>
                    </div>
                  </label>
                </div>
                <button type="button" className="icon-button icon-button--danger" onClick={() => removeProject(project.id)}>
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-frame admin-panel admin-panel-wide">
          <div className="section-heading-row section-heading-row--compact">
            <h2>Certificates</h2>
            <button type="button" className="secondary-button" onClick={addCertificate}>
              <Plus size={16} /> Add certificate
            </button>
          </div>
          <div className="stack-list">
            {content.certificates.map((certificate) => (
              <div key={certificate.id} className="admin-card-editor">
                <div className="admin-form-grid admin-form-grid--projects">
                  <label>
                    Title
                    <input value={certificate.title} onChange={(event) => updateCertificate(certificate.id, 'title', event.target.value)} />
                  </label>
                  <label>
                    Issuer
                    <input value={certificate.issuer} onChange={(event) => updateCertificate(certificate.id, 'issuer', event.target.value)} />
                  </label>
                  <label>
                    Year
                    <input value={certificate.date} onChange={(event) => updateCertificate(certificate.id, 'date', event.target.value)} />
                  </label>
                  <label>
                    Category
                    <select value={certificate.category || 'coding'} onChange={(event) => updateCertificateCategory(certificate.id, event.target.value)}>
                      <option value="coding">Coding Certificate</option>
                      <option value="academic">Academic Certificate</option>
                      <option value="random">Random Certificate</option>
                    </select>
                  </label>
                  <label className="span-2">
                    Certificate image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        uploadImage({
                          file: event.target.files?.[0],
                          path: `portfolio/certificates/${certificate.id}`,
                          key: `certificate-${certificate.id}`,
                          onSuccess: (url) => updateCertificate(certificate.id, 'imageUrl', url),
                        })
                      }
                    />
                    <div className="admin-image-preview-row">
                      <div className="admin-image-preview">
                        {certificate.imageUrl ? <img src={certificate.imageUrl} alt={`${certificate.title} preview`} /> : <span>No preview</span>}
                      </div>
                      <small>{uploadingKey === `certificate-${certificate.id}` ? 'Uploading...' : summarizeImageValue(certificate.imageUrl)}</small>
                    </div>
                  </label>
                </div>
                <button type="button" className="icon-button icon-button--danger" onClick={() => removeCertificate(certificate.id)}>
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-frame admin-panel admin-panel-wide">
          <div className="section-heading-row section-heading-row--compact">
            <h2>Footer contact</h2>
          </div>
          <div className="admin-form-grid admin-form-grid--projects">
            <label>
              Kicker
              <input value={content.footer?.kicker || ''} onChange={(event) => updateFooter('kicker', event.target.value)} />
            </label>
            <label className="span-2">
              Brand name
              <input value={content.footer?.brandName || ''} onChange={(event) => updateFooter('brandName', event.target.value)} />
            </label>
            <label className="span-2">
              Description
              <textarea rows="3" value={content.footer?.description || ''} onChange={(event) => updateFooter('description', event.target.value)} />
            </label>
            <label>
              Phone display
              <input value={content.footer.phoneDisplay} onChange={(event) => updateFooter('phoneDisplay', event.target.value)} />
            </label>
            <label>
              Phone href
              <input value={content.footer.phoneHref} onChange={(event) => updateFooter('phoneHref', event.target.value)} />
            </label>
            <label>
              Email display
              <input value={content.footer.emailDisplay} onChange={(event) => updateFooter('emailDisplay', event.target.value)} />
            </label>
            <label>
              Email href
              <input value={content.footer.emailHref} onChange={(event) => updateFooter('emailHref', event.target.value)} />
            </label>
          </div>
          <div className="section-heading-row section-heading-row--compact">
            <h3>Footer socials</h3>
            <button type="button" className="secondary-button" onClick={() => updateFooter('socials', [...(content.footer?.socials || []), { name: 'New', href: '' }])}>
              <Plus size={16} /> Add social
            </button>
          </div>
          <div className="stack-list">
            {(content.footer?.socials || []).map((soc, idx) => (
              <div key={`${soc.name}-${idx}`} className="stack-row">
                <input value={soc.name} onChange={(event) => {
                  const next = (content.footer?.socials || []).map((s, i) => i === idx ? { ...s, name: event.target.value } : s)
                  updateFooter('socials', next)
                }} />
                <input value={soc.href} onChange={(event) => {
                  const next = (content.footer?.socials || []).map((s, i) => i === idx ? { ...s, href: event.target.value } : s)
                  updateFooter('socials', next)
                }} />
                <button type="button" className="icon-button icon-button--danger" onClick={() => {
                  const next = (content.footer?.socials || []).filter((_, i) => i !== idx)
                  updateFooter('socials', next)
                }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          </div>
        </section>

        <section className="glass-frame admin-panel admin-panel-wide">
          <h2>cool sound i found this morning</h2>
          <div className="admin-form-grid admin-form-grid--projects">
            <label>
              Sound source
              <select
                value={content.uiSettings?.soundSource || 'synth'}
                onChange={(event) => updateUiSetting('soundSource', event.target.value)}
              >
                <option value="synth">Synth</option>
                <option value="custom">Custom audio</option>
              </select>
            </label>
            <label>
              Sound on switch
              <select
                value={content.uiSettings?.soundEnabled ? 'on' : 'off'}
                onChange={(event) => updateUiSetting('soundEnabled', event.target.value === 'on')}
              >
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </label>
            <label>
              Sound volume ({Math.round((content.uiSettings?.soundVolume ?? 0.55) * 100)}%)
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={content.uiSettings?.soundVolume ?? 0.55}
                onChange={(event) => updateUiSetting('soundVolume', Number(event.target.value))}
              />
            </label>
            <label>
              Sound tone (Hz)
              <input
                type="number"
                min="80"
                max="1200"
                step="1"
                value={content.uiSettings?.soundBaseFrequency ?? 330}
                onChange={(event) => updateUiSetting('soundBaseFrequency', Number(event.target.value) || 330)}
              />
            </label>
            <label>
              Sound spread (Hz)
              <input
                type="number"
                min="0"
                max="600"
                step="1"
                value={content.uiSettings?.soundSpread ?? 60}
                onChange={(event) => updateUiSetting('soundSpread', Number(event.target.value) || 0)}
              />
            </label>
            <label>
              Sound wave
              <select
                value={content.uiSettings?.soundWave || 'triangle'}
                onChange={(event) => updateUiSetting('soundWave', event.target.value)}
              >
                <option value="sine">Sine</option>
                <option value="square">Square</option>
                <option value="triangle">Triangle</option>
                <option value="sawtooth">Sawtooth</option>
              </select>
            </label>
            <label className="span-2">
              Custom sound URL
              <input
                type="url"
                placeholder="https://example.com/sound.mp3"
                value={content.uiSettings?.soundCustomUrl || ''}
                onChange={(event) => updateUiSetting('soundCustomUrl', event.target.value)}
              />
            </label>
            <label className="span-2">
              Upload custom sound
              <input type="file" accept="audio/*" onChange={(event) => uploadSound(event.target.files?.[0])} />
              <small>
                {uploadingKey === 'ui-sound'
                  ? 'Uploading...'
                  : content.uiSettings?.soundCustomUrl
                    ? 'Custom sound ready'
                    : 'No custom sound uploaded'}
              </small>
            </label>
            <label>
              Secret tap count
              <input
                type="number"
                min="2"
                max="20"
                value={content.uiSettings?.adminTapCount ?? 10}
                onChange={(event) => updateUiSetting('adminTapCount', Number(event.target.value) || 10)}
              />
            </label>
            <label>
              Secret tap window (ms)
              <input
                type="number"
                min="500"
                max="10000"
                step="100"
                value={content.uiSettings?.adminTapWindowMs ?? 2200}
                onChange={(event) => updateUiSetting('adminTapWindowMs', Number(event.target.value) || 2200)}
              />
            </label>
          </div>
        </section>

        <section className="glass-frame admin-panel admin-panel-wide">
          <h2>about me</h2>
          <div className="admin-form-grid admin-form-grid--projects">
            <label className="span-2">
              Introduction (main intro about you)
              <textarea 
                rows="3" 
                value={content.about?.introduction || ''} 
                onChange={(event) => updateAbout('introduction', event.target.value)} 
              />
            </label>
            <label className="span-2">
              Hobbies (one per line)
              <textarea 
                rows="3" 
                value={content.about?.hobbies?.join('\n') || ''} 
                onChange={(event) => updateAbout('hobbies', event.target.value.split(/\r?\n/))} 
              />
            </label>
            <label className="span-2">
              Fun Facts (one per line)
              <textarea 
                rows="3" 
                value={content.about?.funFacts?.join('\n') || ''} 
                onChange={(event) => updateAbout('funFacts', event.target.value.split(/\r?\n/))} 
              />
            </label>
            <label>
              Favorite Color
              <input 
                value={content.about?.favorites?.color || ''} 
                onChange={(event) => updateAboutFavorites('color', event.target.value)} 
              />
            </label>
            <label>
              Favorite Animal
              <input 
                value={content.about?.favorites?.animal || ''} 
                onChange={(event) => updateAboutFavorites('animal', event.target.value)} 
              />
            </label>
            <label>
              Favorite Food
              <input 
                value={content.about?.favorites?.food || ''} 
                onChange={(event) => updateAboutFavorites('food', event.target.value)} 
              />
            </label>
            <label>
              Favorite Music
              <input 
                value={content.about?.favorites?.music || ''} 
                onChange={(event) => updateAboutFavorites('music', event.target.value)} 
              />
            </label>
            <label className="span-2">
              Personality description
              <textarea 
                rows="3" 
                value={content.about?.personality || ''} 
                onChange={(event) => updateAbout('personality', event.target.value)} 
              />
            </label>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
