import showModal from './modal';
import { createFighterImage } from '../fighterPreview';

export default function showWinnerModal(fighter) {
    // call showModal function
    const { name } = fighter;
    const modalArgs = {
        title: `${name} is win!!!`,
        bodyElement: createFighterImage(fighter),
        onClose() {
            window.location.reload();
        }
    };

    showModal(modalArgs);
}
