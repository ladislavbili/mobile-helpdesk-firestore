import React, { Component } from 'react';
import { Input, Item, Container, Header, Title, Content, Button, Icon, Text, Left, Right, Body, View, Label, CheckBox, Picker, Textarea } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import i18n from 'i18next';
import {processInteger,initialiseCustomAttributes, formatDate, containsNullRequiredAttribute, processCustomAttributes, importExistingCustomAttributesForCompany} from '../../../helperFunctions';
import MultiPicker from '../../../components/multiPicker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { storageHelpPricelistsStart } from '../../../redux/actions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();

/**
* Allows user to add a new company
* @extends Component
*/
class CompanyEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pausal: this.props.company.pausal || 0,
      DIC: this.props.company.DIC || '',
      ICO: this.props.company.ICO || '',
      IC_DPH: this.props.company.IC_DPH || '',
      PSC: this.props.company.PSC || '',
      city: this.props.company.city || '',
      country: this.props.company.country || '',
      description: this.props.company.description || '',
      dph: '' + ( this.props.company.dph || 0 ),
      drivePausal: '' + ( this.props.company.drivePausal || 0 ),
      mail: this.props.company.mail || '',
      monthlyPausal: this.props.company.monthlyPausal || false,
      phone: this.props.company.phone || '',
      pricelist: this.props.company.pricelist || null,
      rented: this.props.company.rented || [],
      street: this.props.company.street || '',
      title: this.props.company.title || '',
      workPausal: '' + ( this.props.company.workPausal || 0 ),
    };
    this.submit.bind(this);
  }

  UNSAFE_componentWillMount(){
    if(!this.props.pricelistsActive){
      this.props.storageHelpPricelistsStart();
    }else if(this.props.pricelistsLoaded){
      let pricelistIDs = this.props.pricelists.map((pricelist)=>pricelist.id);
      if(!pricelistIDs.includes(this.state.pricelist)){
        this.setState({ pricelist: this.props.pricelists.find((pricelist)=> pricelist.def).id });
      }
    }
  }

  UNSAFE_componentWillReceiveProps(props){
    if(props.pricelistsLoaded && !this.props.pricelistsLoaded){
      let pricelistIDs = props.pricelists.map((pricelist) => pricelist.id);
      if(!pricelistIDs.includes(this.state.pricelist)){
        this.setState({ pricelist: props.pricelists.find((pricelist) => pricelist.def).id });
      }
    }
  }

  /**
  * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
  */
  submit(){
    let company={
      pausal: this.state.pausal,
      DIC: this.state.DIC,
      ICO: this.state.ICO,
      IC_DPH: this.state.IC_DPH,
      PSC: this.state.PSC,
      city: this.state.city,
      country: this.state.country,
      description: this.state.description,
      dph: parseInt(this.state.dph),
      drivePausal: parseInt(this.state.drivePausal),
      mail: this.state.mail,
      monthlyPausal: this.state.monthlyPausal,
      phone: this.state.phone,
      pricelist: this.state.pricelist,
      rented: this.state.rented,
      street: this.state.street,
      title: this.state.title,
      workPausal: parseInt(this.state.workPausal),
    };
    database.collection('companies').doc(this.props.company.id).update(company);
    Actions.pop();
  }

  /**
  * Checks, if the input string is an acceptable number
  * @param  {string} value String that should be convertable into string
  * @return {boolean}       If the string contains only numbers
  */
  checkIfNumber(value){
    return /^\d*$/.test(value);
  }

  canSave(){
    return this.state.title !== '' && (
      !this.state.monthlyPausal || ( !isNaN(parseInt(this.state.drivePausal)) && !isNaN(parseInt(this.state.workPausal)) )
    ) &&
    this.state.pricelist !== null
  }

  render() {
    return (
      <Container style={{marginBottom: 15}}>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{i18n.t('addCompany')}</Title>
          </Body>
          <Right>
            { this.canSave() &&
              <Button transparent onPress={this.submit.bind(this)}>
                <Icon active style={{ color: 'white', padding:10 }} name="ios-checkmark-circle-outline" />
              </Button>
            }
          </Right>
        </Header>
        <Content style={{ padding: 15 }}>

          <Text note>{i18n.t('companyName')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Input
              placeholder={i18n.t('enterCompanyName')}
              value={this.state.title}
              onChangeText={(value)=>this.setState({title:value})}
              />
            {
              this.state.title.length === 0 && <Text note style={{color:'red'}}>{i18n.t('companyNameError')}</Text>
            }
        </View>

        <Text note>{i18n.t('dph')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            keyboardType='numeric'
            placeholder={i18n.t('enterDph')}
            value={ this.state.dph }
            onChangeText={ value => {
              let result = this.checkIfNumber(value);
              this.setState({ dph:( result ? value : this.state.dph ) })
            }}
            />
        </View>

        <Text note>{i18n.t('email')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            keyboardType='email-address'
            placeholder={i18n.t('enterEmail')}
            value={this.state.mail}
            onChangeText={(value)=>this.setState({mail:value})}
            />
        </View>

        <Text note>{i18n.t('phone')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            keyboardType='numeric'
            placeholder={i18n.t('enterPhone')}
            value={ this.state.phone }
            onChangeText={ value => {
              let result = this.checkIfNumber(value);
              this.setState({ phone:( result ? value : this.state.phone ) })
            }}
            />
        </View>

        <Text note>{i18n.t('country')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            placeholder={i18n.t('enterCountry')}
            value={this.state.country}
            onChangeText={(value)=>this.setState({ country: value })}
            />
      </View>

      <Text note>{i18n.t('street')}</Text>
      <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
        <Input
          placeholder={i18n.t('enterStreet')}
          value={this.state.street}
          onChangeText={(value)=>this.setState({ street: value })}
          />
    </View>

    <Text note>{i18n.t('city')}</Text>
    <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
      <Input
        placeholder={i18n.t('enterCity')}
        value={this.state.city}
        onChangeText={(value)=>this.setState({ city: value })}
        />
  </View>

  <Text note>{i18n.t('selectPricelist')}</Text>
  <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
    <Picker
      supportedOrientations={['portrait', 'landscape']}
      selectedValue={this.state.pricelist}
      onValueChange={(pricelistID)=>this.setState({pricelist:pricelistID})}>
      {this.props.pricelists.map(
        (pricelist)=> <Picker.Item label={pricelist.title} key={pricelist.id} value={pricelist.id} />
    )}
    </Picker>
  </View>

  <Text note>{i18n.t('DIC')}</Text>
  <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
    <Input
      placeholder={i18n.t('enterDIC')}
      value={this.state.DIC}
      onChangeText={(value)=>this.setState({ DIC: value })}
      />
  </View>

  <Text note>{i18n.t('ICO')}</Text>
  <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
    <Input
      placeholder={i18n.t('enterICO')}
      value={this.state.ICO}
      onChangeText={(value)=>this.setState({ ICO: value })}
      />
  </View>

  <Text note>{i18n.t('IC_DPH')}</Text>
  <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
    <Input
      placeholder={i18n.t('enterIC_DPH')}
      value={this.state.IC_DPH}
      onChangeText={(value)=>this.setState({ IC_DPH: value })}
      />
  </View>

  <Text note>{i18n.t('PSC')}</Text>
  <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
    <Input
      placeholder={i18n.t('enterPSC')}
      value={this.state.PSC}
      onChangeText={(value)=>this.setState({ PSC: value })}
      />
  </View>

  <Text note>{i18n.t('description')}</Text>
  <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
    <Textarea
      placeholder={i18n.t('enterDescription')}
      rowSpan={3}
      value={this.state.description}
      onChangeText={(value)=>this.setState({description:value})}
      />
  </View>

  <Item
    style={{ marginBottom:20, paddingBottom:15, paddingTop:5,   boxShadow:0 }}
    inlineLabel
    onPress={ () => {
      this.setState({ monthlyPausal: !this.state.monthlyPausal });
    }}>
    <CheckBox
      checked={this.state.monthlyPausal}
      color='#3F51B5'
      onPress={ () => {
        this.setState({ monthlyPausal: !this.state.monthlyPausal });
      }}/>
    <Label style={{marginLeft:15}}>{i18n.t('monthlyPausal')}</Label>
  </Item>

  <Text note>{i18n.t('workPausal')}</Text>
  <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
    <Input
      keyboardType='numeric'
      editable={this.state.monthlyPausal}
      placeholder={i18n.t('enterWorkPausal')}
      value={ this.state.workPausal }
      onChangeText={ value => {
        let result = this.checkIfNumber(value);
        this.setState({ workPausal:( result ? value : this.state.workPausal ) })
      }}
      />
  </View>

  <Text note>{i18n.t('drivePausal')}</Text>
  <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
    <Input
      keyboardType='numeric'
      editable={this.state.monthlyPausal}
      placeholder={i18n.t('enterDrivePausal')}
      value={ this.state.drivePausal }
      onChangeText={ value => {
        let result = this.checkIfNumber(value);
        this.setState({ drivePausal:( result ? value : this.state.drivePausal ) })
      }}
      />
  </View>

    </Content>
  </Container>
);
}
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ storageHelpPricelists }) => {
  const { pricelistsActive, pricelists, pricelistsLoaded } = storageHelpPricelists;
  return { pricelistsActive, pricelists, pricelistsLoaded };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, {storageHelpPricelistsStart})(CompanyEdit);
