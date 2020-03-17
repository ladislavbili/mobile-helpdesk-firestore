import React, { Component } from 'react';
import { Input, Item, Container, Header, Title, Content, Button, Icon, Text, Left, Right, Body, View, Label, CheckBox } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import i18n from 'i18next';
import {editCompany} from '../../../redux/actions';
import {processInteger,initialiseCustomAttributes, formatDate, containsNullRequiredAttribute, processCustomAttributes, importExistingCustomAttributesForCompany} from '../../../helperFunctions';
import MultiPicker from '../../../components/multiPicker';
import DateTimePicker from 'react-native-modal-datetime-picker';

/**
* Allows user to add a new company
* @extends Component
*/
class CompanyEdit extends Component {

  constructor(props) {
    super(props);
    let company_data=initialiseCustomAttributes(this.props.companyAttributes);
    company_data= importExistingCustomAttributesForCompany(company_data,[...this.props.company.companyData],[...this.props.companyAttributes]);
    this.state = {
      is_active: this.props.company.is_active,
      title: this.props.company.title ? this.props.company.title : "",
      ico: this.props.company.ico ? this.props.company.ico : "",
      dic: this.props.company.dic ? this.props.company.dic : "",
      ic_dph: this.props.company.ic_dph ? this.props.company.ic_dph : "",
      street: this.props.company.street ? this.props.company.street : "",
      city: this.props.company.city ? this.props.company.city : "",
      zip: this.props.company.zip ? this.props.company.zip : "",
      country: this.props.company.country ? this.props.company.country : "",
      opened:null,
      company_data,
    };
    this.submit.bind(this);
  }

  /**
   * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
   */
  submit(){
    let company={
      title: this.state.title,
      city: this.state.city === "" ? "null" : this.state.city,
      country: this.state.country === "" ? "null" : this.state.country,
      dic: this.state.dic === "" ? "null" : this.state.dic,
      ic_dph: this.state.ic_dph === "" ? "null" : this.state.ic_dph,
      ico: this.state.ico === "" ? "null" : this.state.ico,
      street: this.state.street === "" ? "null" : this.state.street,
      zip: this.state.zip === "" ? "null" : this.state.zip,
      company_data: JSON.stringify(processCustomAttributes({...this.state.company_data},[...this.props.companyAttributes]))
    };
    this.props.editCompany(company,this.state.is_active,this.props.company.id,this.props.token);
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

  render() {
    return (
      <Container>
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
            {this.state.title.length!=0 &&
              !containsNullRequiredAttribute(processCustomAttributes(this.state.company_data,this.props.companyAttributes),[...this.props.companyAttributes])&&
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
              this.state.title.length==0 && <Text note style={{color:'red'}}>{i18n.t('companyNameError')}</Text>
          }
        </View>

        <Text note>{i18n.t('ico')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            keyboardType='numeric'
            placeholder={i18n.t('enterIco')}
            value={this.state.ico}
            onChangeText={ value => {let result = this.checkIfNumber(value); this.setState({ico:(result?value:this.state.ico)})} }
            />
        </View>

        <Text note>{i18n.t('dic')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            placeholder={i18n.t('enterDic')}
            value={this.state.dic}
            onChangeText={(value)=>this.setState({dic:value})}
            />
        </View>

        <Text note>{i18n.t('icDph')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            keyboardType='numeric'
            placeholder={i18n.t('enterIcDph')}
            value={this.state.ic_dph}
            onChangeText={ value => {let result = this.checkIfNumber(value); this.setState({ic_dph:(result?value:this.state.ic_dph)})}}
            />
        </View>

        <Text note>{i18n.t('street')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            placeholder={i18n.t('enterStreet')}
            value={this.state.street}
            onChangeText={(value)=>this.setState({street:value})}
            />
        </View>

        <Text note>{i18n.t('city')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            placeholder={i18n.t('enterCity')}
            value={this.state.city}
            onChangeText={(value)=>this.setState({city:value})}
            />
        </View>

        <Text note>{i18n.t('zipCode')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            placeholder={i18n.t('enterZipCode')}
            keyboardType='numeric'
            value={this.state.zip}
            onChangeText={ value => {let result = this.checkIfNumber(value); this.setState({zip:(result?value:this.state.zip)})}}
            />
        </View>

        <Text note>{i18n.t('country')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            placeholder={i18n.t('enterCountry')}
            value={this.state.country}
            onChangeText={(value)=>this.setState({country:value})}
            />
        </View>

        {this.props.companyAttributes.map(attribute => {
          switch (attribute.type) {
            case "input":{
              return (
                <View key={attribute.id}>
                  <Text note>{attribute.title}</Text>
                  <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                    <Input
                      placeholder={attribute.title}
                      value={this.state.company_data[attribute.id]}
                      onChangeText={ value => {
                        let newData = { ...this.state.company_data };
                        newData[attribute.id] = value;
                        this.setState({ company_data: newData });
                      }}
                      />
                  </View>
                </View>
              );
            }
            case "text_area":{
              return (
                <View key={attribute.id}>
                  <Text note>{attribute.title}</Text>
                  <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                    <Input
                      multiline={true}
                      style={{height:60}}
                      placeholder={attribute.title}
                      value={this.state.company_data[attribute.id]}
                      onChangeText={ value => {
                        let newData = { ...this.state.company_data };
                        newData[attribute.id] = value;
                        this.setState({ company_data: newData });
                      }}
                      />
                  </View>
                </View>
              );
            }
            case "simple_select":{
              return(
                <Picker
                 key={attribute.id}
                  supportedOrientations={['portrait', 'landscape']}
                  iosHeader={i18n.t('selectOne')}
                  mode="dropdown"
                  selectedValue={this.state.company_data[attribute.id]}
                  onValueChange={(value)=>{
                    let newData = { ...this.state.company_data };
                    newData[attribute.id] = value;
                    this.setState({ company_data: newData });
                  }}>
                  {
                    attribute.options.map((item)=>
                    (<Item label={item} key={item} value={item} />)
                  )
                }
              </Picker>
              );
            }
            case "multi_select":{
              //selected title selectTitle options onChange
              return <MultiPicker
                selected={[]}
                title={attribute.title}
                key={attribute.id}
                selectTitle={i18n.t('select')+' '+attribute.title}
                options={attribute.options.map((item)=>{return {id:item, title:item};})}
                onChange={(value)=>{
                  let newData = { ...this.state.company_data };
                  newData[attribute.id] = value;
                  this.setState({ company_data: newData });
                }}
                />;
            }
            case "date":{
              return <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }} key={attribute.id}>
              <Button block style={{backgroundColor:'white'}} onPress={()=>this.setState({open:attribute.id})}>
                <Left>
                  <Text style={{textAlign:'left',color:'black'}}>{this.state.company_data[attribute.id]===null ? i18n.t('selectDate') : formatDate(this.state.company_data[attribute.id])}</Text>
                </Left>
              </Button>
              <DateTimePicker
                mode="datetime"
                isVisible={this.state.open===attribute.id}
                onConfirm={(date)=>{
                  let value = (new Date(date)).getTime();
                  let newData = { ...this.state.company_data };
                  newData[attribute.id] = value;
                  this.setState({ company_data: newData, open:null });
                }}
                onCancel={()=>this.setState({open:null})}
                />
              </View>
            }
            case "decimal_number":{
              return (
                <View key={attribute.id}>
                  <Text note>{attribute.title}</Text>
                  <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                    <Input
                      keyboardType='numeric'
                      placeholder={attribute.title}
                      value={this.state.company_data[attribute.id]}
                      onChangeText={ value => {
                        let newData = { ...this.state.company_data };
                        newData[attribute.id] = value;
                        this.setState({ company_data: newData });
                      }}
                      />
                  </View>
                </View>
              );
            }
            case "integer_number":{
              return (
                <View key={attribute.id}>
                  <Text note>{attribute.title}</Text>
                  <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                    <Input
                      keyboardType='numeric'
                      placeholder={attribute.title}
                      value={this.state.company_data[attribute.id]}
                      onChangeText={ value => {
                        let newData = { ...this.state.company_data };
                        newData[attribute.id] = value;
                        this.setState({ company_data: newData });
                      }}
                      />
                  </View>
                </View>
              );
            }
            case "checkbox":{
              return <Item
                inlineLabel
                key={attribute.id}
                style={{marginBottom:20, borderBottomWidth:0,marginTop:10,paddingBottom:5}}
                onPress={ value => {
                  let newData = { ...this.state.company_data };
                  newData[attribute.id] = !this.state.company_data[attribute.id];
                  this.setState({ company_data: newData });
                }}>
                <CheckBox
                  checked={this.state.company_data[attribute.id]}
                  color='#3F51B5'
                  onPress={ value => {
                    let newData = { ...this.state.company_data };
                    newData[attribute.id] = !this.state.company_data[attribute.id];
                    this.setState({ company_data: newData });
                  }}/>
                <Label style={{marginLeft:15}}>{attribute.title}</Label>
              </Item>

            }
              return <Text key={attribute.id}>{attribute.title}</Text>;

                default:
                return <Text key={attribute.id}>{attribute.title}</Text>;
                }
              })}

      </Content>
    </Container>
  );
}
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({loginReducer, companyReducer}) => {
  const {token} = loginReducer;
  const {company, companyAttributes} = companyReducer;
  return {token, company, companyAttributes};
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, {editCompany})(CompanyEdit);
