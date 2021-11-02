
import { render } from '@testing-library/react';
import MentionsLegales from './MentionsLegales';

describe('MentionsLegales', () => {
    it('renders', () => {
        const { container } = render(<MentionsLegales />);

        expect(container).toMatchSnapshot();
    });
});
