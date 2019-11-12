import React, { Component } from 'react';
import { Steps } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';

import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';
import styles from './form.module.css';

const { Step } = Steps;

const steps = [
  {
    title: 'Empty Building',
  },
  {
    title: 'Extra Information',
  },
  {
    title: 'Personal Information',
  },
];

class Form extends Component {
  state = {
    current: 0,
    stepOneValues: {
      city: '',
      address: '',
      previousUse: '',
      owner: '',
      isOwnerLocal: '',
    },
    stepTwoValues: {
      emptyPeriod: '',
      extraInfo: '',
      preferredUse: '',
      thumbnail: '',
    },
    stepThreeValues: {
      reporterName: '',
      reporterEmail: '',
      reporterAddress: '',
      receiveNotifications: '',
      shareData: '',
    },
  };

  getStepOneValues = values => {
    const { stepOneValues } = this.state;
    this.setState({
      stepOneValues: {
        ...stepOneValues,
        ...values,
      },
    });
  };

  getStepTwoValues = values => {
    const { stepTwoValues } = this.state;
    this.setState({
      stepTwoValues: {
        ...stepTwoValues,
        ...values,
      },
    });
  };

  getStepThreeValues = values => {
    const { stepThreeValues } = this.state;
    this.setState({
      stepThreeValues: {
        ...stepThreeValues,
        ...values,
      },
    });
  };

  handleConfirm = values => {
    const { stepThreeValues } = this.state;
    this.setState(
      {
        stepThreeValues: {
          ...stepThreeValues,
          ...values,
        },
      },
      () => this.sendData(),
    );
  };

  sendData = async () => {
    const { stepOneValues, stepTwoValues, stepThreeValues } = this.state;
    const data = {
      ...stepOneValues,
      ...stepTwoValues,
      ...stepThreeValues,
    };
    console.log('data: ', data);
    try {
      const dummy = {
        city: 'Morecambe',
        latitude: 52.06835,
        longitude: -1.86108,
        address: 'Morecambe',
        owner: 'Someone',
        isOwnerLocal: 'Yes',
        preferredUse: 'N/A',
        emptyPeriod: '1 year',
        extraInfo: 'more info about this building',
        approved: true,
        receiveNotifications: false,
        reporterName: 'Som',
        reporterEmail: 'ahmed@gmail.com',
        reporterAddress: 'gaza',
      };
      await axios.post('/api/v1/report-building', dummy);
    } catch (err) {
      console.log(err);
    }
  };

  getStep = current => {
    const { stepOneValues, stepTwoValues, stepThreeValues } = this.state;

    const { city, address, onCityChange } = this.props;

    switch (current) {
      case 0:
        return (
          <FirstStep
            stepOneValues={stepOneValues}
            city={city}
            address={address}
            onCityChange={onCityChange}
            submittedValues={this.getStepOneValues}
            handleNext={() => this.next()}
          />
        );
      case 1:
        return (
          <SecondStep
            stepTwoValues={stepTwoValues}
            submittedValues={this.getStepTwoValues}
            handleNext={() => this.next()}
            handleBack={() => this.prev()}
          />
        );
      case 2:
        return (
          <ThirdStep
            stepThreeValues={stepThreeValues}
            submittedValues={this.getStepThreeValues}
            handleBack={() => this.prev()}
            handleConfirm={this.handleConfirm}
          />
        );
      default:
        return <FirstStep />;
    }
  };

  next() {
    let { current } = { ...this.state };
    current += 1;
    this.setState({ current });
  }

  prev() {
    let { current } = { ...this.state };
    current -= 1;
    this.setState({ current });
  }

  render() {
    const { current } = this.state;
    return (
      <div className={styles.form}>
        <Steps current={current} className={styles.steps}>
          {steps.map(item => (
            <Step key={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{this.getStep(current)}</div>
      </div>
    );
  }
}

Form.propTypes = {
  city: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  onCityChange: PropTypes.func.isRequired,
};

export default Form;
