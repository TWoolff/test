import { submitForm } from '@/services/submit';
import css from './Form.module.css';

type FormProps = {
  children: React.ReactNode;
  className?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form: React.FC<FormProps> = ({ children, className, onSubmit }) => {

  return ( 
    <form onSubmit={onSubmit} className={`${className} ${css.form}`}>
      {children}
    </form>
  );
}

export default Form;