import React, { ReactNode, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import Text from '@/components/Text';
import { Container, AccordionIcon } from '@/components/Accordion/styled';
import { ArrowDownIcon } from '@/components/icons';

type Props = {
  header?: ReactNode;
  headerComp?: ReactNode;
  content: string | ReactNode;
  className?: string;
};

const AccordionComponent = ({ header, headerComp, content, className }: Props) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Container className={className}>
      <Accordion>
        <Accordion.Item eventKey="0" className="accordion_item">
          <Accordion.Header
            className="accordion_header"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            {headerComp
              ? headerComp
              : header && (
                  <Text fontWeight="medium" color="text-primary" size="body-large">
                    {header}
                  </Text>
                )}
            <AccordionIcon>
              <ArrowDownIcon />
            </AccordionIcon>
          </Accordion.Header>
          <Accordion.Body className="accordion_body">{content}</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default AccordionComponent;
