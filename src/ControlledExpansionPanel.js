import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';

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
    const classes = this.props.classes;
    let mapData = (this.props.mapData === null ? [] : this.props.mapData);
    const { expanded } = this.state;
    let listItems = <Typography className={classes.heading}>No Violations Visible</Typography>

    if (mapData.length > 0) {
      listItems = mapData.map((violation) =>
          <ExpansionPanel key={violation.properties.UUID} expanded={expanded === violation.properties.UUID} onChange={this.handleChange(violation.properties.UUID)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Grid item xs={12}>
                <Typography className={classes.heading}>{ violation.properties.ADDRESS } </Typography>
              </Grid>
              <Grid item xs={12}>
              <Typography className={classes.secondaryHeading}>{ violation.properties.SRC }</Typography>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.secondaryHeading}>APN</Typography>
                <Typography>{ violation.properties.PARCEL_APN}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography className={classes.secondaryHeading}>Address</Typography>
                <Typography>{ violation.properties.ADDRESS } </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography className={classes.secondaryHeading}>SRC</Typography>
                <Typography>{ violation.properties.SRC} </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography className={classes.secondaryHeading}>STATUS</Typography>
                <Typography>{ violation.properties.STATUS} </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography className={classes.secondaryHeading}>TYPE</Typography>
                <Typography>{ violation.properties.TYPE}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography className={classes.secondaryHeading}>UUID</Typography>
                <Typography>{ violation.properties.UUID} </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography className={classes.secondaryHeading}>VIOLATOR</Typography>
                <Typography>{ violation.properties.VIOLATOR} </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography className={classes.secondaryHeading}>ISSUE_DATE</Typography>
                <Typography>{ violation.properties.ISSUE_DATE} </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography className={classes.secondaryHeading}>COMPLY_BY</Typography>
                <Typography>{ violation.properties.COMPLY_BY} </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography className={classes.secondaryHeading}>ADDITIONAL_1</Typography>
                <Typography>{ violation.properties.ADDITIONAL_1} </Typography>
              </Grid>


              <Grid item xs={12} sm={6}>
                <Typography className={classes.secondaryHeading}>ADDITIONAL_2</Typography>
                <Typography>{ violation.properties.ADDITIONAL_2} </Typography>
              </Grid>



            </Grid>

            </ExpansionPanelDetails>
          </ExpansionPanel>
      );

    }



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

