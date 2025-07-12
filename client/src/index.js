import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import store from './redux/store';
import { Result, Button } from 'antd';
import { BrowserRouter } from 'react-router-dom';

// Root level error boundary class
class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Root level error caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Application Error"
          subTitle={`Something went wrong at the application root: ${this.state.error?.message || 'Unknown error'}`}
          extra={[
            <Button type="primary" key="reload" onClick={() => window.location.reload()}>
              Reload Application
            </Button>,
            <Button key="home" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>,
          ]}
        />
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RootErrorBoundary>
    <Provider store={store}>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </Provider>
  </RootErrorBoundary>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
