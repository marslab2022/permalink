import '../App.css';

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { appLogo, appName } from '../Defines';

export const Commit = (props) => {
  return (
    <div>
      <div className='center'>
        <div>
          {appLogo}
        </div>
        <div>
          <a href={props.url} className='appName'> {appName} </a>
        </div>
        <div className='version'>
          v&nbsp;{props.version}
        </div>
      </div>
      <div className='description'>
        <ReactMarkdown children={props.description} remarkPlugins={[remarkGfm]} />
      </div>
    </div>
  );
}