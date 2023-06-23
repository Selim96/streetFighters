import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // todo: show fighter info (image, name, health, etc.)
    if (fighter) {
        const fighterImage = createFighterImage(fighter);
        const slicedFighter = Object.entries(fighter).filter(([first]) => first !== '_id' && first !== 'source');
        const descriptionBlock = slicedFighter.map(([key, value]) => {
            const element = createElement({
                tagName: 'p',
                className: 'description__item'
            });
            const elementKey = createElement({
                tagName: 'span',
                className: 'description__key'
            });
            const buffer = createElement({
                tagName: 'span',
                className: 'description__buffer'
            });
            elementKey.textContent = `${key}: `;
            element.textContent = `${value}`;
            element.prepend(elementKey, buffer);
            return element;
        });
        const description = createElement({
            tagName: 'div',
            className: 'description'
        });
        description.append(...descriptionBlock);
        fighterElement.append(fighterImage, description);
    }

    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
