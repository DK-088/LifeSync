import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Home, MessageSquare, Search, Plus, Info } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function AnalyticsScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Groceries");
  const [viewMode, setViewMode] = useState("Monthly");

  const categories = ["Groceries", "Transportation", "Rent", "Medical", "Travel"];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require("../assets/Arc_bg.png")}
        style={styles.backgroundImage}
        imageStyle={{ top: undefined, bottom: 0 }}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Expense Analytics</Text>
            </View>

            {/* Category Selector */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryContent}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat && styles.categoryButtonActive
                  ]}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === cat && styles.categoryTextActive
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Expense Analysis Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Expense Analysis</Text>
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    onPress={() => setViewMode("Monthly")}
                    style={[styles.toggleButton, viewMode === "Monthly" && styles.toggleButtonActive]}
                  >
                    <Text style={[styles.toggleText, viewMode === "Monthly" && styles.toggleTextActive]}>Monthly</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setViewMode("Weekly")}
                    style={[styles.toggleButton, viewMode === "Weekly" && styles.toggleButtonActive]}
                  >
                    <Text style={[styles.toggleText, viewMode === "Weekly" && styles.toggleTextActive]}>Weekly</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.chartArea}>
                {/* Simulated Line Chart */}
                <View style={styles.lineChart}>
                  {/* Grid Lines */}
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <View key={i} style={styles.gridLine} />
                  ))}
                  <Text style={[styles.chartLabel, { top: 0 }]}>6k</Text>
                  <Text style={[styles.chartLabel, { top: '16%' }]}>5k</Text>
                  <Text style={[styles.chartLabel, { top: '33%' }]}>4k</Text>
                  <Text style={[styles.chartLabel, { top: '50%' }]}>3k</Text>
                  <Text style={[styles.chartLabel, { top: '66%' }]}>2k</Text>
                  <Text style={[styles.chartLabel, { top: '83%' }]}>1k</Text>
                  <Text style={[styles.chartLabel, { top: '100%' }]}>0</Text>

                  {/* Simulated Line Path using absolute segments */}
                  <View style={styles.linePath} />
                  <View style={[styles.dot, { left: '10%', bottom: '33%' }]} />
                  <View style={[styles.dot, { left: '30%', bottom: '60%' }]} />
                  <View style={[styles.dot, { left: '45%', bottom: '70%' }]} />
                  <View style={[styles.dot, { left: '55%', bottom: '90%' }]} />
                  <View style={[styles.dot, { left: '65%', bottom: '40%' }]} />
                  <View style={[styles.dot, { left: '80%', bottom: '33%' }]} />
                  <View style={[styles.dot, { left: '95%', bottom: '60%' }]} />

                  {/* Tooltip */}
                  <View style={[styles.tooltip, { left: '75%', bottom: '75%' }]}>
                    <Text style={styles.tooltipText}>+31.99k</Text>
                  </View>
                </View>

                {/* X-Axis Labels */}
                <View style={styles.xAxis}>
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => (
                    <Text key={m} style={styles.xAxisText}>{m}</Text>
                  ))}
                </View>
                {/* Scroll indicator dots */}
                <View style={styles.dotIndicator}>
                  <View style={styles.dotSmall} />
                  <View style={styles.dotLarge} />
                  <View style={styles.dotSmall} />
                </View>
              </View>
            </View>

            {/* Account Activity Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Account Activity</Text>
                <Info size={20} color="rgba(0,0,0,0.2)" />
              </View>

              <View style={styles.activityContent}>
                <View style={styles.barChartContainer}>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <View key={i} style={styles.barPair}>
                      <View style={[styles.barTop, { height: 10 + Math.random() * 30 }]} />
                      <View style={[styles.barBottom, { height: 5 + Math.random() * 20 }]} />
                    </View>
                  ))}
                </View>

                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Income</Text>
                    <Text style={styles.statValue}>42.05%</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Outcome</Text>
                    <Text style={styles.statValue}>31.29%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Safe spacing for bottom bar */}
            <View style={{ height: 120 }} />
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.navBar}>
            <View style={styles.navInner}>
              <TouchableOpacity style={styles.navItemActive}>
                <Home size={24} color="#fff" />
                <Text style={styles.navTextActive}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <MessageSquare size={24} color="rgba(0,0,0,0.3)" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Search size={24} color="rgba(0,0,0,0.3)" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.plusButton}>
              <Plus size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 22,
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  categoryScroll: {
    marginVertical: 10,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#8a5cf5",
  },
  categoryText: {
    fontFamily: "Outfit_500Medium",
    fontSize: 16,
    color: "#000",
  },
  categoryTextActive: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 32,
    padding: 24,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 18,
    color: "#000",
    opacity: 0.8,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toggleButtonActive: {
    backgroundColor: "#8a5cf5",
  },
  toggleText: {
    fontFamily: "Outfit_500Medium",
    fontSize: 12,
    color: "rgba(0,0,0,0.4)",
  },
  toggleTextActive: {
    color: "#fff",
  },
  chartArea: {
    marginTop: 10,
    marginLeft: 20
  },
  lineChart: {
    height: 200,
    position: "relative",
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  gridLine: {
    height: 1,
    backgroundColor: "#f0f0f0",
    width: "100%",
    marginBottom: 32,
  },
  chartLabel: {
    position: "absolute",
    left: -20,
    fontSize: 12,
    color: "rgba(0,0,0,0.3)",
    fontFamily: "Outfit_400Regular",
  },
  linePath: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    // Note: In real app use react-native-svg for the path
  },
  dot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#8a5cf5",
    borderWidth: 2,
    borderColor: "#fff",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tooltipText: {
    fontSize: 12,
    fontFamily: "Outfit_600SemiBold",
    color: "rgba(0,0,0,0.3)",
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 5,
  },
  xAxisText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.4)",
    fontFamily: "Outfit_400Regular",
  },
  dotIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  dotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#8a5cf5",
    opacity: 0.2,
    marginHorizontal: 4,
  },
  dotLarge: {
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#8a5cf5",
    marginHorizontal: 4,
  },
  activityContent: {
    marginTop: 10,
  },
  barChartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 100,
    marginBottom: 20,
  },
  barPair: {
    width: 4,
    alignItems: "center",
  },
  barTop: {
    width: 4,
    backgroundColor: "#8a5cf5",
    borderRadius: 2,
    marginBottom: 2,
  },
  barBottom: {
    width: 4,
    backgroundColor: "#ff5b5b",
    borderRadius: 2,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
    paddingTop: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: "rgba(0,0,0,0.3)",
    marginBottom: 4,
  },
  statValue: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 32,
    color: "#462c8a",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 10,
  },
  navBar: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
  },
  navInner: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 40,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  navItemActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8a5cf5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  navTextActive: {
    color: "#fff",
    fontFamily: "Outfit_600SemiBold",
    marginLeft: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  plusButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#8a5cf5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: "#8a5cf5",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
});
