import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subscription from '../models/Subscription';
import User from '../models/User';

dotenv.config();

/**
 * Script to create or update user subscriptions
 * Usage: npm run create-subscription <username> <plan>
 * Example: npm run create-subscription john.doe pro
 */

const createSubscription = async (username: string, plan: 'free' | 'basic' | 'pro') => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      console.error(`❌ User not found: ${username}`);
      process.exit(1);
    }

    // Check if subscription exists
    let subscription = await Subscription.findOne({ user: user._id });

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 days

    const messageLimits = {
      free: 10,
      basic: 100,
      pro: 999999 // Unlimited
    };

    if (subscription) {
      // Update existing subscription
      subscription.plan = plan;
      subscription.status = 'active';
      subscription.endDate = endDate;
      subscription.messageLimit = messageLimits[plan];
      subscription.messagesUsed = 0;
      await subscription.save();
      console.log(`✅ Subscription updated for ${username}`);
    } else {
      // Create new subscription
      subscription = new Subscription({
        user: user._id,
        plan,
        status: 'active',
        endDate,
        messageLimit: messageLimits[plan],
        messagesUsed: 0
      });
      await subscription.save();
      console.log(`✅ Subscription created for ${username}`);
    }

    console.log('\n📊 Subscription Details:');
    console.log(`User: ${user.name} (${user.username})`);
    console.log(`Plan: ${subscription.plan.toUpperCase()}`);
    console.log(`Status: ${subscription.status}`);
    console.log(`Message Limit: ${subscription.messageLimit === 999999 ? 'Unlimited' : subscription.messageLimit}`);
    console.log(`Messages Used: ${subscription.messagesUsed}`);
    console.log(`End Date: ${subscription.endDate.toLocaleDateString()}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: npm run create-subscription <username> <plan>');
  console.error('Plans: free, basic, pro');
  process.exit(1);
}

const [username, plan] = args;
if (!['free', 'basic', 'pro'].includes(plan)) {
  console.error('Invalid plan. Use: free, basic, or pro');
  process.exit(1);
}

createSubscription(username, plan as 'free' | 'basic' | 'pro');
