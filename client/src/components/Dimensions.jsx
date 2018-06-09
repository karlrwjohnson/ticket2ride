import React from 'react';

export default function injectDimensions({
    style,
    className,
    widthPropName = 'width',
    heightPropName = 'height',
} = {}) {
    const combinedStyle = {
        ...style,
        position: 'relative !important',
        overflow: 'hidden !important',
    };

    return WrappedComponent => class DimensionsWrapper extends React.Component {

        domElement = null;

        state = {
            width: 0,
            height: 0,
        };

        componentDidMount() {
            window.addEventListener('resize', this.onResize);
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.onResize);
        }

        onRef = (ref) => {
            this.domElement = ref;
            this.onResize();
        };

        onResize = () => {
            if (this.domElement) {
                const {
                    clientWidth: width,
                    clientHeight: height,
                } = this.domElement;

                if (width !== this.state.width || height !== this.state.height) {
                    this.setState({ width, height });
                }
            }
        };

        render() {
            const {
                onRef,
                props,
                state: { width, height },
            } = this;

            const combinedProps = {
                ...props,
                [widthPropName]: width,
                [heightPropName]: height,
            };

            return (
                <div className={className} style={combinedStyle} ref={onRef}>
                    <WrappedComponent {...combinedProps} />
                </div>
            );
        }
    };
}
