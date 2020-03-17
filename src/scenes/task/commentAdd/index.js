
import React, { Component } from 'react';
import { Tab, Tabs, Container} from 'native-base';
import { connect } from 'react-redux';
import TabComment from './tabComment';
import TabEmail from './tabEmail';
import i18n from 'i18next';

/**
 * Creates tabs that allows the user to send either comments or comments and e-mails
 * @extends Component
 */
export default class CommentAdd extends Component {

  render() {
    return (
      <Container>
        <Tabs>
          <Tab heading={'+' + i18n.t('comment')}>
            <TabComment id={this.props.id} ACL={this.props.ACL} />
          </Tab>
          {
            this.props.ACL.includes('sent_emails_from_comments') &&
            <Tab heading={"+"+ i18n.t('email')}>
              <TabEmail id={this.props.id} ACL={this.props.ACL} />
            </Tab>
          }
        </Tabs>
      </Container>
    );
  }
}
