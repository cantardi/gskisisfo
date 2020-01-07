import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { DateConvert } from '../../helpers/function';

const styles = StyleSheet.create({
  body: {
    padding: 5
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  dateBlock: {
    padding: 8,
    margin: 5,
    flex: "1 0 45%",
    width: "45%"
  },
  periodTitle: {
    color: "#0c5460",
    backgroundColor: "#d1ecf1",
    borderColor: "#bee5eb",
    padding: 10,
    margin: 10,
    borderStyle: "solid",     
    borderWidth: 1, 
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    textAlign: "center",
    fontFamily: "Times-Roman",
    fontSize: 24,
  },
  dateTitle: {
    fontSize: 12,
    padding: 5,
    textAlign: "center",
    fontFamily: 'Helvetica'
  },
  table: { 
    display: "table",
    borderStyle: "solid", 
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0, 
    borderTopWidth: 0
  }, 
  tableRow: { 
    flexDirection: "row",
  },
  tableCol1: {
    width: "5%", 
    borderStyle: "solid", 
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderRightWidth: 0, 
    borderBottomWidth: 0
  },
  tableCol2: {
    width: "60%", 
    borderStyle: "solid", 
    borderColor: '#bfbfbf',
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0
  },
  tableCol3: {
    width: "25%", 
    borderStyle: "solid", 
    borderColor: '#bfbfbf',
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0
  },
  tableCol4: {
    width: "10%", 
    borderStyle: "solid", 
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderRightWidth: 0, 
    borderBottomWidth: 0
  },
  tableCell: { 
    textAlign: "center",
    fontSize: 8,
    padding: 2,
    fontFamily: 'Helvetica'
  },
  tableCellSmall: { 
    textAlign: "left",
    fontSize: 5,
    padding: 2,
    fontFamily: 'Helvetica'
  }
});

const SongPdf = (props) => (

  <Document>

    <Page style={styles.body} size="A4" orientation="portrait">

      <Text style={styles.periodTitle}>{ props.periodName } ({ props.periodDescr })</Text>

      <View style={styles.wrapper}>
        {
          props.periodDates.map(date => {
            return(
              <View key={date.id} style={styles.dateBlock}>
                
                <Text style={styles.dateTitle}>
                  { DateConvert(new Date(date.predefineddate)) }
                </Text>

                <View style={styles.table}>
               
                  <View style={styles.tableRow}>
                    <View style={styles.tableCol1}>  
                      <Text style={[styles.tableCell, { fontFamily: "Helvetica-Bold" }]}>#</Text>
                    </View>
                    <View style={styles.tableCol2}>  
                      <Text style={[styles.tableCell, { fontFamily: "Helvetica-Bold", textAlign: "left" }]}>Song Name</Text>
                    </View>
                    <View style={styles.tableCol3}>  
                      <Text style={[styles.tableCell, { fontFamily: "Helvetica-Bold" }]}>Type</Text>  
                    </View>
                    <View style={styles.tableCol4}>  
                      <Text style={[styles.tableCell, { fontFamily: "Helvetica-Bold" }]}>Key</Text>
                    </View>
                  </View>

                  {
                    props.songSchedule.length > 0 &&
                    props.songSchedule
                    .filter(song => Number(song.dateid)===date.id)
                    .map((song, i) => {
                      return (
                        <View key={`tr-${date.id}-${song.id}`} style={styles.tableRow}>
                          <View style={styles.tableCol1}>
                            <Text style={styles.tableCell}>{i+1}</Text>
                          </View>
                          <View style={styles.tableCol2}>  
                            <Text style={[styles.tableCell, {textAlign: "left"}]}> { song.songname } </Text>
                            <Text style={styles.tableCellSmall}>{ song.lyric.split('\n')[0] }... </Text>
                          </View>
                          <View style={styles.tableCol3}>  
                            <Text style={styles.tableCell}>{ song.songtypedescr }</Text>
                          </View>
                          <View style={styles.tableCol4}>  
                            <Text style={styles.tableCell}>{ song.songkeydescr }</Text>
                          </View>
                        </View>
                      )
                    })
                  }
                </View>    
              </View>
            )
          })
        }
      </View>
    </Page>
  </Document>
);

export default SongPdf;