import React from 'react';

import { Container, StepItem } from './Steps.styled';
import { VerifyIcon } from '@/components/icons';
import Text from '@/components/Text';

export interface IStep {
  title: string;
  content: () => React.ReactElement;
}

interface StepsProps {
  currentStep: number;
  steps: IStep[];
}

const Steps = (props: StepsProps) => (
  <Container>
    {props.steps.map((step, index) => {
      const isSelected = index === props.currentStep;
      const isVerify = index < props.currentStep;
      return (
        <StepItem
          key={index.toString()}
          isSelected={isSelected}
          isVerify={isVerify}
          hideIndicatorLeft={index === 0}
          hideIndicatorRight={index === props.steps.length - 1}
        >
          <div className="content">
            <div className="indicator-container">
              <div className="indicator-left" />
              <div className="number-container">
                {isVerify ? <VerifyIcon /> : <p className="number">{index + 1}</p>}
              </div>
              <div className="indicator-right" />
            </div>
            <Text className="title">{step.title}</Text>
          </div>
        </StepItem>
      );
    })}
  </Container>
);

export default React.memo(Steps);
