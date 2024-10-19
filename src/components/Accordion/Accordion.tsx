import css from './Accordion.module.css'

type AccordionProps = {
  title: string
  content: React.ReactNode
}

const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
  return (
    <details className={css.accordion}>
      <summary>
        <h2>{title}</h2>
      </summary>
      <>{content}</>
    </details>
  )
}

export default Accordion