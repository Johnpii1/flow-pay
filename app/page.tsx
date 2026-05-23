'use client';

import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StreamCard from '@/components/layout/StreamCard';
import { useAccount } from 'wagmi';
import {
  useUserStreams,
  useProtocolStats,
  useActiveStreams,
  useStreamEvents
} from '@/hooks/useStreamContract';
import { formatWeiToEther } from '@/lib/utils';
import {
  Activity,
  TrendingUp,
  Users,
  Clock,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const liveTips = useMemo(
    () => [
      '💡 Pro tip: Start with a template then tweak the stream rate.',
      '⚡ Live mode: Use short durations to test payouts instantly.',
      '🔒 Safety check: Review recipient address before confirming.'
    ],
    []
  );

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    setIsClient(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((current) => (current + 1) % liveTips.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [liveTips.length]);

  const { sentStreams, receivedStreams } = useUserStreams(
    mounted && isClient ? address : undefined
  );
  const { stats } = useProtocolStats();
  const { activeStreamIds } = useActiveStreams();
  const { recentEvents } = useStreamEvents();

  // Loading state
  if (!mounted || !isClient) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Wallet not connected
  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="max-w-md mx-auto">
          <Zap className="h-24 w-24 text-somnia-500 mx-auto mb-4" />

          <h1 className="text-3xl font-bold mb-4">
            Welcome to FLOWPAY
          </h1>

          <p className="text-muted-foreground mb-8">
            Connect your wallet to start streaming payments in real-time
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-somnia-500" />
              Per-second payment streaming
            </div>
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Real-time balance updates
            </div>
            <div className="flex items-center justify-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              Work, subscription & gaming streams
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-somnia-500 to-somnia-600 text-white border-0">
          <CardContent className="p-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back 👋
              </h1>
              <p className="text-somnia-100">
                Manage your real-time payment streams
              </p>

              <div className="flex gap-3 mt-4">
                <Button asChild variant="secondary">
                  <Link href="/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Stream
                  </Link>
                </Button>

                <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link href="/templates">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Templates
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden md:block">
              <Zap className="h-20 w-20 text-white/20" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Launch */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/15 border-primary/50">
          <CardContent className="p-6 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold">
                Quick Launch Studio
              </h2>
              <p className="text-sm text-muted-foreground">
                Smart tips to build faster payment streams
              </p>
            </div>

            <div className="px-4 py-3 border-2 border-foreground rounded-lg bg-background">
              <p className="text-sm font-semibold">
                {liveTips[tipIndex]}
              </p>
            </div>

            <Button asChild>
              <Link href="/create">
                <Plus className="h-4 w-4 mr-2" />
                Launch Stream
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* LIVE TICKER */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-lg border-2 border-foreground bg-card py-3 neo-shadow">
          <div className="animate-stream-flow whitespace-nowrap">
            <span className="mx-8 text-sm font-bold">🔴 LIVE • FlowPay active streaming</span>
            <span className="mx-8 text-sm font-bold">⚡ Real-time payouts every second</span>
            <span className="mx-8 text-sm font-bold">🛡️ Secure smart contract execution</span>
            <span className="mx-8 text-sm font-bold">📊 Analytics updating live</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Streams</CardTitle>
          </CardHeader>
          <CardContent>{stats?.totalStreams || 0}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Streams</CardTitle>
          </CardHeader>
          <CardContent>{stats?.activeStreams || 0}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.totalVolume
              ? `${formatWeiToEther(stats.totalVolume, 2)} STT`
              : '0 STT'}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Streams</CardTitle>
          </CardHeader>
          <CardContent>
            {(sentStreams?.length || 0) +
              (receivedStreams?.length || 0)}
          </CardContent>
        </Card>
      </motion.div>

      {/* Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Outgoing Streams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {sentStreams?.slice().reverse().map((id) => (
                <StreamCard
                  key={id}
                  streamId={id}
                  isReceived={false}
                />
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Incoming Streams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {receivedStreams?.slice().reverse().map((id) => (
                <StreamCard
                  key={id}
                  streamId={id}
                  isReceived={true}
                />
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}