import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Octicon, { Comment, GitBranch, Terminal } from '@githubprimer/octicons-react';

import TemplateInput from './template-input';

import format, { defaults, helpers } from '../../../common/format';
import * as example from './example';

function InputIcon({ icon }) {
  return (
    <Octicon
      icon={icon}
      size="small"
      width="16"
      height="16"
      verticalAlign="text-top"
    />
  );
}

InputIcon.propTypes = {
  icon: PropTypes.func.isRequired,
};

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      branch: '',
      commit: '',
      command: '',
    };

    this.handleLoaded = this.handleLoaded.bind(this);
    this.handleChanged = this.handleChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSaved = this.handleSaved.bind(this);
  }

  componentDidMount() {
    const { store } = this.props;
    store.get(null).then(this.handleLoaded);
  }

  handleLoaded(data) {
    const { templates } = data || {};
    this.setState(() => ({
      loading: false,
      ...templates,
    }));
  }

  handleChanged({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { store } = this.props;
    const { branch, commit, command } = this.state;
    const templates = { branch, commit, command };

    this.setState(() => ({ loading: true }), () => {
      store.set({ templates }).then(this.handleSaved);
    });
  }

  handleSaved() {
    this.setState(() => ({ loading: false }));
  }

  render() {
    const { loading, ...templates } = this.state;

    const fmt = format(templates);

    const fields = [
      {
        icon: <InputIcon icon={Comment} />,
        label: 'Commit Message Format',
        id: 'commit-message-format',
        name: 'commit',
        value: templates.commit,
        fallback: defaults.commit,
        preview: fmt.commit(example),
        multiline: true,
      },
      {
        icon: <InputIcon icon={GitBranch} />,
        label: 'Branch Name Format',
        id: 'branch-name-format',
        name: 'branch',
        value: templates.branch,
        fallback: defaults.branch,
        preview: fmt.branch(example),
      },
      {
        icon: <InputIcon icon={Terminal} />,
        label: 'Command Format',
        id: 'command-format',
        name: 'command',
        value: templates.command,
        fallback: defaults.command,
        preview: fmt.command(example),
      },
    ];

    const input = props => (
      <TemplateInput
        key={props.id}
        disabled={loading}
        onChange={this.handleChanged}
        {...props}
      />
    );

    return (
      <form onSubmit={this.handleSubmit} className="mw-100 px-2 py-3">
        {fields.map(input)}

        <hr />

        <div className="container-fluid px-0">
          <div className="row no-gutters">
            <div className="col small">
              Template variables:
              <ul className="list-unstyled text-muted">
                {Object.keys(example).sort().map(name => <li key={name}>{name}</li>)}
                <li>branch (only in command)</li>
                <li>commit (only in command)</li>
              </ul>
            </div>

            <div className="col small">
              Available Helpers:
              <ul className="list-unstyled text-muted">
                {Object.keys(helpers).sort().map(name => <li key={name}>{name}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <button className="btn btn-outline-primary" type="submit" disabled={loading}>
            Save
          </button>
        </div>
      </form>
    );
  }
}

Form.propTypes = {
  store: PropTypes.shape({
    get: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
  }).isRequired,
};

export default Form;
