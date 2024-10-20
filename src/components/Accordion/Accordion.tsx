import { useState } from 'react'
import { IconArrow } from '../Icons/Icons'
import css from './Accordion.module.css'

type AccordionProps = {
  title: string
  content: React.ReactNode
}

const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <details 
      className={`${css.accordion} ${isOpen ? css.open : ''}`}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary>
        <h2>{title}</h2>
        <div className={css.arrow}>
          <IconArrow />
        </div>
      </summary>
      {content}
    </details>
  )
}

export default Accordion
