import { render } from '@testing-library/react'
import Button from './Button'

jest.mock('@material-ui/core', () => ({
    Button: ({ children }) => <div className="mui-button-mock">{ children }</div>,
    makeStyles: () => () => ({}),
}))

describe('Button', () => {
    it('displays button', () => {
        const mock = jest.fn()
        const { container } = render(
            <Button buttonClasses="fooClass" handleClick={mock}>
                Foo
            </Button>,
        )

        expect(container).toMatchSnapshot()
    })
})
