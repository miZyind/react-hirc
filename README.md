# react-hirc

[![NodeJS](https://img.shields.io/node/v/react-hirc?style=for-the-badge&label=&color=339933&logo=node.js&logoColor=fff)](https://nodejs.org)
[![NPM](https://img.shields.io/npm/v/react-hirc?style=for-the-badge&label=&color=cb3837&logo=npm)](https://www.npmjs.com/package/react-hirc)
[![TypeScript](https://img.shields.io/npm/dependency-version/react-hirc/dev/typescript?style=for-the-badge&label=&color=007acc&logo=typescript)](https://www.typescriptlang.org)
[![React](https://img.shields.io/npm/dependency-version/react-hirc/react?style=for-the-badge&label=&color=61dafb&logo=react&logoColor=fff)](https://reactjs.org)
[![Prettier](https://img.shields.io/github/package-json/dependency-version/mizyind/react-hirc/dev/prettier?style=for-the-badge&label=&color=f7b93e&logo=prettier&logoColor=fff)](https://prettier.io)
[![License](https://img.shields.io/badge/LIC.-mit-404040?style=for-the-badge&labelColor=000)](https://github.com/miZyind/react-hirc/blob/master/LICENSE)


**React Hooks (Immer + Reducer + Context)**

## Installation

```bash
yarn add react-hirc
```

## Usage

### context/ui.ts

```typescript
// Node module
import { createAction, createContext } from 'react-hirc';

enum DisplayTypes {
  // > 1200
  LARGE_MONITOR = 'large monitor',
  // 992 ~ 1200
  SMALL_MONITOR = 'small monitor',
  // 768 ~ 991
  TABLET = 'tablet',
  // < 768
  MOBILE = 'mobile',
}

interface IState {
  displayType: DisplayTypes;
}

const initialState: IState = {
  displayType: DisplayTypes.LARGE_MONITOR,
};

enum ActionTypes {
  WINDOW_RESIZE = '[ui] window resize',
}

const actionCreators = {
  windowResize: (width: number) =>
    createAction(ActionTypes.WINDOW_RESIZE, width),
};

const { ContextProvider, useContext } = createContext(
  initialState,
  actionCreators,
  (draft, action) => {
    switch (action.type) {
      case ActionTypes.WINDOW_RESIZE:
        const { payload: width } = action;
        if (width > 1200) {
          draft.displayType = DisplayTypes.LARGE_MONITOR;
        }
        if (width >= 992 && width <= 1200) {
          draft.displayType = DisplayTypes.SMALL_MONITOR;
        }
        if (width >= 768 && width <= 991) {
          draft.displayType = DisplayTypes.TABLET;
        }
        if (width < 768) {
          draft.displayType = DisplayTypes.MOBILE;
        }
        break;
    }
  },
);

export { ContextProvider as UIContextProvider, useContext as useUIContext };
```

### pages/_app.tsx

```tsx
// Node module
import React from 'react';
import App, { Container } from 'next/app';
// Context
import { UIContextProvider } from '../contexts/ui';

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <UIContextProvider>
          <Component {...pageProps} />
        </UIContextProvider>
      </Container>
    );
  }
}
```

### pages/index.tsx

```tsx
// Node module
import React, { useEffect } from 'react';
// Context
import { useUIContext } from '../contexts/ui';

const Index: React.FC = () => {
  const {
    state: { displayType },
    actions: { windowResize },
  } = useUIContext();

  useEffect(() => {
    const handleResize = () => windowResize(innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (<h1>DisplayType: {displayType}</h1>);
};

export default Index;
```

## Author

miZyind <mizyind@gmail.com>

## LICENSE

Licensed under the [MIT](LICENSE) License.
