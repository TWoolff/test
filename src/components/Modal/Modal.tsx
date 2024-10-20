'use client'
import { AnimatePresence, motion } from 'framer-motion'
import css from './Modal.module.css'

type ModalProps = {
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, children }) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className={css.modalOverlay}>
					<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={e => e.stopPropagation()} className={css.modalContent}>
						<div className={css.modalInner}>
							{children}
							<button onClick={() => setIsOpen(false)} className={css.close}>
								close
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default Modal
