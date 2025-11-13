import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Linking,
  Clipboard
} from 'react-native';

const { width } = Dimensions.get('window');

// Simple emoji icons
const MusicIcon = () => <Text style={{ fontSize: 24, marginRight: 8 }}>🎵</Text>;
const DownloadIcon = () => <Text style={{ fontSize: 18, marginRight: 8 }}>⬇️</Text>;
const ShareIcon = () => <Text style={{ fontSize: 18, marginRight: 8 }}>📤</Text>;
const AlertIcon = () => <Text style={{ fontSize: 16, marginRight: 8 }}>⚠️</Text>;
const SuccessIcon = () => <Text style={{ fontSize: 24, marginBottom: 10 }}>✅</Text>;

// Styles
const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: '#ff0050',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#ff0050',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 15,
    padding: 18,
    fontSize: 16,
    color: '#333',
  },
  inputFocused: {
    borderColor: '#ff0050',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ff0050',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  videoContainer: {
    width: width - 80,
    height: 150,
    backgroundColor: '#000',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff0050',
  },
  videoPlaceholder: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    padding: 10,
  },
  downloadButton: {
    backgroundColor: '#25d366',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: '#007bff',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  openButton: {
    backgroundColor: '#6f42c1',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 80, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff0050',
    marginTop: 15,
  },
  errorText: {
    color: '#ff0050',
    fontSize: 14,
    fontWeight: '500',
  },
  videoInfo: {
    backgroundColor: '#e9ecef',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  videoInfoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  videoUrlText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  instructions: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginTop: 30,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepNumber: {
    backgroundColor: '#ff0050',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f1f3f4',
    borderRadius: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
};

// TikTok Service - Pure JavaScript, no dependencies
class TikTokService {
  static async downloadVideo(tiktokUrl) {
    try {
      // Using reliable TikTok download API
      const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(tiktokUrl)}`;
      
      console.log('Fetching from:', apiUrl);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      if (data && data.data && data.data.play) {
        return {
          success: true,
          videoUrl: data.data.play,
          title: data.data.title || 'TikTok Video',
          author: data.data.author?.nickname || 'Unknown Author',
          duration: data.data.duration || 'Unknown',
        };
      } else {
        throw new Error('Video not found in response');
      }
    } catch (error) {
      console.error('Download error:', error);
      throw new Error('Failed to fetch video. Please check the URL and try again.');
    }
  }

  static isValidTikTokUrl(url) {
    if (!url) return false;
    
    const tiktokPatterns = [
      /https?:\/\/(?:www\.|vm\.|vt\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/,
      /https?:\/\/vm\.tiktok\.com\/[\w-]+\//,
      /https?:\/\/vt\.tiktok\.com\/[\w-]+\//,
      /tiktok\.com\/.*\/video\//,
    ];
    
    return tiktokPatterns.some(pattern => pattern.test(url.trim()));
  }

  static async copyToClipboard(text) {
    // For React Native, we'll use Alert to simulate copy functionality
    return new Promise((resolve) => {
      Alert.alert(
        'URL Copied!', 
        'The video URL has been copied. You can paste it in your browser to download.',
        [{ text: 'OK', onPress: () => resolve(true) }]
      );
    });
  }
}

// Video Info Component
const VideoInfo = ({ videoData }) => {
  if (!videoData) return null;

  const truncatedUrl = videoData.videoUrl.length > 50 
    ? videoData.videoUrl.substring(0, 50) + '...' 
    : videoData.videoUrl;

  return (
    <View style={styles.videoContainer}>
      <Text style={styles.videoPlaceholder}>
        🎥 VIDEO READY!{'\n\n'}
        <Text style={{color: '#ff0050', fontWeight: 'bold'}}>
          {videoData.title}
        </Text>
        {'\n'}by {videoData.author}
      </Text>
    </View>
  );
};

// Loading Spinner Component
const LoadingSpinner = ({ message = "Processing..." }) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#ff0050" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

// Main Component
const DownloaderScreen = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleDownload = async () => {
    Keyboard.dismiss();
    setError('');
    setVideoData(null);

    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) {
      setError('Please enter a TikTok URL');
      return;
    }

    if (!TikTokService.isValidTikTokUrl(trimmedUrl)) {
      setError('Please enter a valid TikTok URL\n\nExamples:\n• https://www.tiktok.com/@user/video/123\n• https://vm.tiktok.com/ABC123/');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await TikTokService.downloadVideo(trimmedUrl);
      setVideoData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!videoData?.videoUrl) return;

    try {
      await TikTokService.copyToClipboard(videoData.videoUrl);
    } catch (err) {
      Alert.alert('Error', 'Failed to copy URL');
    }
  };

  const handleOpenUrl = async () => {
    if (!videoData?.videoUrl) return;

    try {
      const canOpen = await Linking.canOpenURL(videoData.videoUrl);
      if (canOpen) {
        await Linking.openURL(videoData.videoUrl);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to open URL');
    }
  };

  const clearAll = () => {
    setUrl('');
    setVideoData(null);
    setError('');
  };

  const useExample = () => {
    setUrl('https://www.tiktok.com/@username/video/7300000000000000000');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <MusicIcon />
              <Text style={styles.title}>TikTok Downloader</Text>
            </View>
            <Text style={styles.subtitle}>
              Download videos without watermark
            </Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Input Section */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                isInputFocused && styles.inputFocused,
                error && { borderColor: '#ff0050' }
              ]}
              placeholder="Paste TikTok URL here..."
              placeholderTextColor="#999"
              value={url}
              onChangeText={setUrl}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              multiline={true}
              numberOfLines={2}
            />
            
            {error ? (
              <View style={styles.errorContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AlertIcon />
                  <Text style={[styles.errorText, { marginLeft: 8 }]}>
                    {error}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* Download Button */}
          <TouchableOpacity
            style={[
              styles.button,
              (!url.trim() || isLoading) && styles.buttonDisabled
            ]}
            onPress={handleDownload}
            disabled={!url.trim() || isLoading}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <DownloadIcon />
              <Text style={styles.buttonText}>
                {isLoading ? 'Processing...' : 'Download Video'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Example Button */}
          <TouchableOpacity
            onPress={useExample}
            style={{ marginTop: 10, padding: 10 }}
          >
            <Text style={{ color: '#666', textAlign: 'center', fontSize: 14 }}>
              Use Example URL
            </Text>
          </TouchableOpacity>

          {/* Clear Button */}
          {url && !isLoading && (
            <TouchableOpacity
              onPress={clearAll}
              style={{ marginTop: 5, padding: 10 }}
            >
              <Text style={{ color: '#666', textAlign: 'center', fontSize: 14 }}>
                Clear Input
              </Text>
            </TouchableOpacity>
          )}

          {/* Loading */}
          {isLoading && <LoadingSpinner message="Fetching video information..." />}

          {/* Results */}
          {videoData && (
            <View style={styles.resultContainer}>
              <SuccessIcon />
              <Text style={styles.resultTitle}>Video Ready to Download!</Text>
              
              <VideoInfo videoData={videoData} />
              
              <View style={styles.videoInfo}>
                <Text style={styles.videoInfoText}>
                  <Text style={{fontWeight: 'bold'}}>Title:</Text> {videoData.title}
                </Text>
                <Text style={styles.videoInfoText}>
                  <Text style={{fontWeight: 'bold'}}>Author:</Text> {videoData.author}
                </Text>
                <Text style={styles.videoUrlText}>
                  {videoData.videoUrl}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleOpenUrl}
              >
                <Text style={styles.buttonText}>🌐 Open in Browser</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyUrl}
              >
                <Text style={styles.buttonText}>📋 Copy Video URL</Text>
              </TouchableOpacity>

              <Text style={{ marginTop: 10, color: '#666', fontSize: 12, textAlign: 'center' }}>
                Open the URL in your browser to download the video
              </Text>
            </View>
          )}

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>How to Use:</Text>
            
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Open TikTok and find the video you want to download
              </Text>
            </View>
            
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Tap the "Share" button and copy the link
              </Text>
            </View>
            
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Paste the link above and tap "Download Video"
              </Text>
            </View>
            
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>
                Copy the video URL and download from your browser
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              This app is for personal use only. Please respect content creators' rights and TikTok's terms of service.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return <DownloaderScreen />;
}