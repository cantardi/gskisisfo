import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { DateConvert } from '../../helpers/function';

const styles = StyleSheet.create({
  
  titleWrapper: {
    backgroundColor: "#004EA6",
    padding: 10
  },

  periodTitle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 3,
  },

  summaryWrapper: {
    padding: 15,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "left",
    alignItems: "flex-start"
  },

  dateTitle: {
    fontSize: 10,
    color: "#985600",
    marginBottom: 5,
    textAlign: "left",
    fontFamily: "Helvetica-Bold"
  },

  dateBlock: {
    marginBottom: 20,
    marginLeft: 20,
    flex: "1 0 auto",
    width: "45%"
  },

  dateTitleInDetail: {
    color: "white",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 3,
  },

  detailWrapper: {
    paddingTop: 15,
    display: "flex",
    flexDirection: "column",
    flexFlow: "row",
    maxHeight: "800px",
    width: "100%",
    flexWrap: "wrap",
    alignItems: "flex-start"
  },

  songBlock: {
    marginBottom: 10,
    marginLeft: 10,
    flex: "1 0 auto",
    width: "31%",
    borderStyle: "solid",     
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderRightWidth: 0,
    borderBottomWidth: 0
  },

  songTitle: {
    fontSize: 9,
    padding: 5,
    textAlign: "left",
    fontFamily: 'Helvetica-Bold',
  },

  songLyrics: {
    fontSize: 8,
    padding: 5,
    textAlign: "left",
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
    fontSize: 9,
    padding: 2,
    fontFamily: 'Helvetica'
  },

  tableCellSmall: { 
    textAlign: "left",
    fontSize: 7,
    paddingLeft: 2,
    paddingRight: 2,
    paddingBottom: 2,
    fontFamily: 'Helvetica'
  }

});

const SongPdf = (props) => (

  <Document>

    <Page size="A4" orientation="portrait">
      
      <View style={styles.titleWrapper}>
        <Text style={styles.periodTitle} fixed>{"Praise and Worship"}</Text>
        <Text style={styles.periodTitle} fixed>{props.periodDescr}</Text>
      </View>   

      <View style={styles.summaryWrapper}>
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
                            <Text style={styles.tableCellSmall}>{ song.lyric.split('\n')[0] } </Text>
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

      {
        props.periodDates.map(date => {
          return(
            <View key={`hdr-${date.id}`} break>
              
              <View key={`dtl-${date.id}`} style={styles.titleWrapper} fixed>
                <Text style={styles.dateTitleInDetail}>
                  { DateConvert(new Date(date.predefineddate)) }
                </Text>
              </View>

              <View key={`dtl-${date.id}`} style={styles.detailWrapper}>
              {
                props.songSchedule.length > 0 &&
                props.songSchedule
                .filter(song => Number(song.dateid)===date.id)
                .map((song, i) => {
                  return (
                    <View key={`dtl-${date.id}-${song.id}`} style={styles.songBlock}>
                      <Text style={styles.songTitle}>{`${song.songname} (Do=${song.songkeydescr})`}</Text>
                      <Text style={styles.songLyrics}>{song.lyric}</Text>
                    </View>
                  )
                })
              }
              </View>
              
            </View>
          )
        })
      }

    </Page>
  </Document>
);

export default SongPdf;