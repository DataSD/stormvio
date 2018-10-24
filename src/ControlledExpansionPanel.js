import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class ControlledExpansionPanels extends React.Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    console.log(this.props);
    const classes = this.props.classes;
    let mapData = (this.props.mapData === null ? [] : this.props.mapData);
    const { expanded } = this.state;


    const listItems = mapData.map((violation) =>
        <ExpansionPanel key={violation.properties.UUID} expanded={expanded === violation.properties.UUID} onChange={this.handleChange(violation.properties.UUID)}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>{ violation.properties.TYPE} </Typography>
            <Typography className={classes.secondaryHeading}>{ violation.properties.STATUS }</Typography>
            <Typography className={classes.secondaryHeading}>{ violation.properties.APN}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              { violation.properties.type }
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
    );




    return (
      <div className={classes.root}>
      {listItems}
      </div>
    );
  }
}

ControlledExpansionPanels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ControlledExpansionPanels);

